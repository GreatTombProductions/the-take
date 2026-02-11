import { useState } from 'react';
import type { Tour, TourDate, DateResult, TourTotals, Venue, LodgingEstimate, RoutingLeg } from '../types';
import { formatCurrency, formatPct } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  tour: Tour;
  results: DateResult[];
  totals: TourTotals;
  onUpdateVenue: (dateIndex: number, patch: Partial<Venue>) => void;
  onUpdateLodging: (dateIndex: number, patch: Partial<LodgingEstimate>) => void;
  onUpdateRouting: (dateIndex: number, patch: Partial<RoutingLeg>) => void;
  onUpdateAllVenues: (patch: Partial<Venue>) => void;
  onUpdateAllLodging: (patch: Partial<LodgingEstimate>) => void;
  onAddDate: (date: TourDate) => void;
  onRemoveDate: (dateIndex: number) => void;
  onScrollToOngoingExpenses?: () => void;
  onScrollToManagement?: () => void;
}

// "Edit All" popover for batch-editing a column
function EditAllPopover({
  label,
  type,
  step,
  min,
  max,
  onApply,
  onClose,
}: {
  label: string;
  type: 'number' | 'percent' | 'currency';
  step?: number;
  min?: number;
  max?: number;
  onApply: (value: number) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const n = parseFloat(draft);
    if (isNaN(n)) return;
    onApply(type === 'percent' ? n / 100 : n);
    onClose();
  };

  return (
    <div className="absolute top-full left-0 mt-1 z-50 bg-surface-800 border border-blue-500 rounded-lg p-3 shadow-lg min-w-[180px]">
      <div className="text-xs text-gray-400 mb-2">Set all {label} to:</div>
      <div className="flex gap-2">
        <input
          autoFocus
          type="number"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') onClose(); }}
          step={step}
          min={min}
          max={max}
          placeholder={type === 'percent' ? '%' : type === 'currency' ? '$' : '#'}
          className="w-20 bg-surface-900 border border-surface-600 rounded px-2 py-1 text-sm font-mono text-gray-200 focus:border-blue-500 focus:outline-none"
        />
        <button onClick={commit} className="px-2 py-1 text-xs bg-blue-900/30 border border-blue-900/50 rounded hover:bg-blue-900/50 text-blue-400">
          Apply
        </button>
        <button onClick={onClose} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-300">
          x
        </button>
      </div>
    </div>
  );
}

// Column header with optional "edit all" button
function ColumnHeader({
  label,
  editable,
  editAllConfig,
  className = '',
}: {
  label: string;
  editable?: boolean;
  editAllConfig?: {
    type: 'number' | 'percent' | 'currency';
    step?: number;
    min?: number;
    max?: number;
    onApply: (value: number) => void;
  };
  className?: string;
}) {
  const [showEditAll, setShowEditAll] = useState(false);

  if (!editable || !editAllConfig) {
    return <th className={className}>{label}</th>;
  }

  return (
    <th className={`${className} relative`}>
      <div className="flex items-center justify-end gap-1">
        <span>{label}</span>
        <button
          onClick={() => setShowEditAll(!showEditAll)}
          className="text-[10px] text-blue-500 hover:text-blue-400 opacity-60 hover:opacity-100 transition-opacity"
          title={`Set all ${label}`}
        >
          [all]
        </button>
      </div>
      {showEditAll && (
        <EditAllPopover
          label={label}
          type={editAllConfig.type}
          step={editAllConfig.step}
          min={editAllConfig.min}
          max={editAllConfig.max}
          onApply={editAllConfig.onApply}
          onClose={() => setShowEditAll(false)}
        />
      )}
    </th>
  );
}

export default function DateBreakdown({
  tour, results, totals,
  onUpdateVenue, onUpdateLodging, onUpdateRouting,
  onUpdateAllVenues, onUpdateAllLodging,
  onAddDate, onRemoveDate,
  onScrollToOngoingExpenses, onScrollToManagement,
}: Props) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="section-card">
      <h2 className="section-title">Tour Date Breakdown</h2>
      <p className="text-sm text-gray-400 mb-4">
        Per-venue revenue and expense estimates. Click any highlighted value to edit.
        Venue names link to venue websites.
        <span className="text-blue-400/60 ml-1">
          Grayed values (Mgmt, Per Diem, Crew) are derived — click to jump to where they're configured.
        </span>
      </p>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>City</th>
              <th>Venue</th>
              <ColumnHeader
                label="Cap"
                editable
                editAllConfig={{
                  type: 'number',
                  onApply: (v) => onUpdateAllVenues({ capacity: v }),
                }}
                className="text-right"
              />
              <ColumnHeader
                label="Att %"
                editable
                editAllConfig={{
                  type: 'percent',
                  step: 1,
                  min: 0,
                  max: 100,
                  onApply: (v) => onUpdateAllVenues({ estimatedAttendanceRate: v }),
                }}
                className="text-right"
              />
              <th className="text-right">Est. Att</th>
              <th className="text-right">Merch Gross</th>
              <ColumnHeader
                label="Venue %"
                editable
                editAllConfig={{
                  type: 'percent',
                  step: 1,
                  min: 0,
                  max: 100,
                  onApply: (v) => onUpdateAllVenues({ merchCutPct: v }),
                }}
                className="text-right"
              />
              <th className="text-right">COGS</th>
              <th className="text-right">Mgmt</th>
              <th className="text-right">Net Merch</th>
              <th className="text-right">Miles</th>
              <th className="text-right">Fuel</th>
              <ColumnHeader
                label="Lodging"
                editable
                editAllConfig={{
                  type: 'currency',
                  min: 0,
                  onApply: (v) => onUpdateAllLodging({ estimatedCost: v }),
                }}
                className="text-right"
              />
              <th className="text-right">Per Diem</th>
              <th className="text-right">Crew</th>
              <th className="text-right">Day P&L</th>
              <th className="text-right">Cumulative</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const netColor = r.dateNet >= 0 ? 'text-green-400' : 'text-red-400';
              const cumColor = r.cumulativeNet >= 0 ? 'text-green-400' : 'text-red-400';
              return (
                <tr key={r.date.index} className="group">
                  <td className="text-gray-500">{r.date.index}</td>
                  <td className="text-gray-300">{formatDate(r.date.date)}</td>
                  <td className="text-gray-300">{r.date.city}, {r.date.stateOrProvince}</td>
                  <td>
                    <a
                      href={r.date.venue.venueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {r.date.venue.name}
                    </a>
                  </td>
                  <td className="text-right font-mono text-gray-300">
                    <EditableCell
                      value={r.date.venue.capacity}
                      displayValue={r.date.venue.capacity.toLocaleString()}
                      onChange={(v) => onUpdateVenue(r.date.index, { capacity: v as number })}
                      min={0}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-300">
                    <EditableCell
                      value={r.date.venue.estimatedAttendanceRate}
                      displayValue={formatPct(r.date.venue.estimatedAttendanceRate)}
                      onChange={(v) => onUpdateVenue(r.date.index, { estimatedAttendanceRate: v as number })}
                      type="percent"
                      step={1}
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-300">{r.revenue.attendance}</td>
                  <td className="text-right font-mono text-gray-200">{formatCurrency(r.revenue.merchGross)}</td>
                  <td className="text-right font-mono text-gray-400">
                    <EditableCell
                      value={r.date.venue.merchCutPct}
                      displayValue={formatPct(r.date.venue.merchCutPct)}
                      onChange={(v) => onUpdateVenue(r.date.index, { merchCutPct: v as number })}
                      type="percent"
                      step={1}
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-500">{formatCurrency(r.revenue.cogs)}</td>
                  <td className="text-right font-mono text-gray-500">
                    <span
                      onClick={onScrollToManagement}
                      className="cursor-pointer hover:text-blue-400 transition-colors border-b border-dotted border-gray-600 hover:border-blue-400"
                      title="Click to edit Management % in Parameters"
                    >
                      {formatCurrency(r.revenue.mgmtCut)}
                    </span>
                  </td>
                  <td className="text-right font-mono text-gray-200">{formatCurrency(r.revenue.netMerch)}</td>
                  <td className="text-right font-mono text-gray-400">
                    <EditableCell
                      value={r.date.routing.miles}
                      displayValue={String(r.date.routing.miles)}
                      onChange={(v) => onUpdateRouting(r.date.index, { miles: v as number })}
                      min={0}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-400">{formatCurrency(r.expenses.fuel)}</td>
                  <td className="text-right font-mono text-gray-400">
                    <EditableCell
                      value={r.date.lodging.estimatedCost}
                      displayValue={formatCurrency(r.date.lodging.estimatedCost)}
                      onChange={(v) => onUpdateLodging(r.date.index, { estimatedCost: v as number })}
                      type="currency"
                      min={0}
                    />
                  </td>
                  <td className="text-right font-mono text-gray-400">
                    <span
                      onClick={onScrollToOngoingExpenses}
                      className="cursor-pointer hover:text-blue-400 transition-colors border-b border-dotted border-gray-600 hover:border-blue-400"
                      title="Click to edit in Daily & Per-Show Costs"
                    >
                      {formatCurrency(r.expenses.perDiem)}
                    </span>
                  </td>
                  <td className="text-right font-mono text-gray-400">
                    <span
                      onClick={onScrollToOngoingExpenses}
                      className="cursor-pointer hover:text-blue-400 transition-colors border-b border-dotted border-gray-600 hover:border-blue-400"
                      title="Click to edit in Daily & Per-Show Costs"
                    >
                      {formatCurrency(r.expenses.merchPerson)}
                    </span>
                  </td>
                  <td className={`text-right font-mono font-semibold ${netColor}`}>{formatCurrency(r.dateNet)}</td>
                  <td className={`text-right font-mono font-semibold ${cumColor}`}>{formatCurrency(r.cumulativeNet)}</td>
                  <td className="text-center">
                    <button
                      onClick={() => { if (confirm(`Remove ${r.date.city} (${formatDate(r.date.date)})?`)) onRemoveDate(r.date.index); }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs px-1"
                      title="Remove date"
                    >
                      x
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-surface-600 font-semibold">
              <td colSpan={7} className="text-white pt-3">Tour Totals</td>
              <td className="text-right font-mono text-white pt-3">{formatCurrency(totals.grossMerch)}</td>
              <td className="pt-3"></td>
              <td className="text-right font-mono text-gray-400 pt-3">{formatCurrency(totals.cogs)}</td>
              <td className="text-right font-mono text-gray-400 pt-3">{formatCurrency(totals.mgmtCuts)}</td>
              <td className="text-right font-mono text-white pt-3">{formatCurrency(totals.netMerch)}</td>
              <td colSpan={5} className="text-right font-mono text-gray-400 pt-3">
                Expenses: {formatCurrency(totals.totalExpenses)}
              </td>
              <td className={`text-right font-mono font-bold pt-3 ${totals.tourNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totals.tourNet)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Add date */}
      {adding ? (
        <AddDateForm
          tour={tour}
          onAdd={(date) => { onAddDate(date); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
        >
          + Add Date
        </button>
      )}
    </section>
  );
}

function AddDateForm({ tour, onAdd, onCancel }: { tour: Tour; onAdd: (d: TourDate) => void; onCancel: () => void }) {
  const nextIndex = Math.max(...tour.dates.map(d => d.index), 0) + 1;
  const lastDate = tour.dates[tour.dates.length - 1];

  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [date, setDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [capacity, setCapacity] = useState(800);
  const [miles, setMiles] = useState(0);

  const submit = () => {
    if (!city || !date || !venueName) return;
    const d = new Date(date + 'T12:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    onAdd({
      index: nextIndex,
      date,
      dayOfWeek: days[d.getDay()],
      city,
      stateOrProvince: state,
      venue: {
        name: venueName,
        capacity,
        capacitySourceUrl: '',
        venueUrl: '',
        estimatedAttendanceRate: 0.70,
        merchCutPct: 0.15,
      },
      routing: {
        fromCity: lastDate ? `${lastDate.city}, ${lastDate.stateOrProvince}` : 'Home',
        toCity: `${city}, ${state}`,
        miles,
      },
      lodging: { type: 'camper', estimatedCost: 0 },
    });
  };

  return (
    <div className="mt-4 bg-surface-700 rounded-lg p-4 border border-surface-600">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <input placeholder="Date (YYYY-MM-DD)" value={date} onChange={e => setDate(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input placeholder="City" value={city} onChange={e => setCity(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input placeholder="State/Province" value={state} onChange={e => setState(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input placeholder="Venue" value={venueName} onChange={e => setVenueName(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input type="number" placeholder="Miles from prev" value={miles} onChange={e => setMiles(Number(e.target.value))}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <div className="flex gap-2">
          <button onClick={submit}
            className="px-3 py-1 text-xs bg-blue-900/30 border border-blue-900/50 rounded hover:bg-blue-900/50 text-blue-400">
            Add
          </button>
          <button onClick={onCancel}
            className="px-3 py-1 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
