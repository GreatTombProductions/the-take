import { useState } from 'react';
import type { Tour, AdditionalRevenue as AdditionalRevenueType } from '../types';
import { formatCurrency, totalAdditionalRevenue } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  tour: Tour;
  onUpdateRevenue: (idx: number, patch: Partial<AdditionalRevenueType>) => void;
  onAddRevenue: (revenue: AdditionalRevenueType) => void;
  onRemoveRevenue: (idx: number) => void;
}

export default function AdditionalRevenue({ tour, onUpdateRevenue, onAddRevenue, onRemoveRevenue }: Props) {
  const [adding, setAdding] = useState(false);
  const items = tour.additionalRevenue ?? [];
  const numDates = tour.dates.length;

  return (
    <section className="section-card">
      <h2 className="section-title">Additional Revenue</h2>
      <p className="text-sm text-gray-400 mb-4">
        Non-merch income: show guarantees, label tour support, sponsorships, content deals, etc.
        These are added to total revenue alongside merch net.
      </p>

      <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item</th>
            <th className="text-right">Amount</th>
            <th className="text-right">Frequency</th>
            <th className="text-right">Tour Total</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="text-gray-500 text-center py-4">
                No additional revenue streams. Click "Add Revenue" to model guarantees, sponsorships, etc.
              </td>
            </tr>
          )}
          {items.map((rev, i) => {
            const tourTotal = rev.frequency === 'per_show' ? rev.amount * numDates : rev.amount;
            return (
              <tr key={i} className="group">
                <td className="text-gray-400">
                  <EditableCell
                    value={rev.category}
                    onChange={(v) => onUpdateRevenue(i, { category: v as string })}
                    type="text"
                  />
                </td>
                <td className="text-gray-200">
                  <EditableCell
                    value={rev.label}
                    onChange={(v) => onUpdateRevenue(i, { label: v as string })}
                    type="text"
                  />
                </td>
                <td className="text-right font-mono text-gray-300">
                  <EditableCell
                    value={rev.amount}
                    displayValue={formatCurrency(rev.amount)}
                    onChange={(v) => onUpdateRevenue(i, { amount: v as number })}
                    type="currency"
                    min={0}
                  />
                </td>
                <td className="text-right">
                  <select
                    value={rev.frequency}
                    onChange={(e) => onUpdateRevenue(i, { frequency: e.target.value as 'per_show' | 'per_tour' })}
                    className="bg-surface-900 border border-surface-600 rounded px-1 py-0 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="per_show">Per Show</option>
                    <option value="per_tour">Per Tour</option>
                  </select>
                </td>
                <td className="text-right font-mono text-green-400">{formatCurrency(tourTotal)}</td>
                <td className="text-gray-500 text-sm max-w-[200px] truncate">
                  <EditableCell
                    value={rev.note}
                    onChange={(v) => onUpdateRevenue(i, { note: v as string })}
                    type="text"
                  />
                </td>
                <td className="text-center">
                  <button
                    onClick={() => { if (confirm(`Remove "${rev.label}"?`)) onRemoveRevenue(i); }}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs px-1"
                    title="Remove"
                  >
                    x
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
        {items.length > 0 && (
          <tfoot>
            <tr className="border-t-2 border-surface-600">
              <td colSpan={4} className="font-semibold text-white pt-3">Total Additional Revenue</td>
              <td className="text-right font-mono font-bold text-green-400 pt-3">
                {formatCurrency(totalAdditionalRevenue(tour))}
              </td>
              <td colSpan={2}></td>
            </tr>
          </tfoot>
        )}
      </table>
      </div>

      {adding ? (
        <AddRevenueForm
          onAdd={(rev) => { onAddRevenue(rev); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
        >
          + Add Revenue
        </button>
      )}
    </section>
  );
}

function AddRevenueForm({ onAdd, onCancel }: { onAdd: (r: AdditionalRevenueType) => void; onCancel: () => void }) {
  const [category, setCategory] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [frequency, setFrequency] = useState<'per_show' | 'per_tour'>('per_tour');
  const [note, setNote] = useState('');

  const submit = () => {
    if (!label) return;
    onAdd({ category: category || 'Other', label, amount, frequency, note });
  };

  return (
    <div className="mt-4 bg-surface-700 rounded-lg p-4 border border-surface-600">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input placeholder="Label (required)" value={label} onChange={e => setLabel(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input type="number" placeholder="Amount ($)" value={amount || ''} onChange={e => setAmount(Number(e.target.value))}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <select value={frequency} onChange={e => setFrequency(e.target.value as 'per_show' | 'per_tour')}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none">
          <option value="per_tour">Per Tour</option>
          <option value="per_show">Per Show</option>
        </select>
        <div className="flex gap-2">
          <button onClick={submit}
            className="px-3 py-1 text-xs bg-green-900/30 border border-green-900/50 rounded hover:bg-green-900/50 text-green-400">
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
