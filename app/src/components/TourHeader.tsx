import { useState } from 'react';
import type { Tour, TourTotals, ScenarioName } from '../types';
import { formatCurrency, totalRoutingMiles } from '../engine';
import ScenarioSelector from './ScenarioSelector';

interface Props {
  tour: Tour;
  totals: TourTotals;
  scenarioName: ScenarioName;
  onScenarioChange: (s: ScenarioName) => void;
  isDirty?: boolean;
}

export default function TourHeader({ tour, totals, scenarioName, onScenarioChange }: Props) {
  const subject = tour.bands.find(b => b.id === tour.subjectBandId)!;
  const miles = totalRoutingMiles(tour);

  const [expanded, setExpanded] = useState<string | null>(null);
  const toggle = (id: string) => setExpanded(prev => prev === id ? null : id);

  const revenueBreakdown: BreakdownItem[] = [
    { label: 'Gross Merch', value: totals.grossMerch },
    { label: 'Guarantees', value: totals.showGuarantees },
    { label: 'Additional', value: totals.additionalRevenue },
  ];

  const expenseBreakdown: BreakdownItem[] = [
    { label: 'COGS', value: totals.cogs },
    { label: 'Venue Cuts', value: totals.venueCuts },
    { label: 'Mgmt Cuts', value: totals.mgmtCuts },
    { label: 'Booking Agent', value: totals.bookingAgentCuts },
    { label: 'Pre-Tour', value: totals.preTourExpenses },
    { label: 'Fuel', value: totals.fuelExpenses },
    { label: 'Lodging', value: totals.lodgingExpenses },
    { label: 'Per Diem', value: totals.perDiemExpenses },
    { label: 'Merch Person', value: totals.crewExpenses },
    { label: 'Off-Day', value: totals.offDayExpenses },
  ];

  return (
    <header className="section-card">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{tour.name}</h1>
          <p className="text-gray-400 mt-1">
            Tour economics forecast for <span className="text-white font-semibold">{subject.name}</span>
            {' '}({subject.billPosition}, {tour.dates.length} dates)
          </p>
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="pill pill-blue">{subject.spotifyMonthlyListeners.toLocaleString()} monthly listeners</span>
            <span className="pill pill-gray">{subject.members} members + {subject.crew} crew</span>
            <span className={`pill ${subject.hasTouredBefore ? 'pill-green' : 'pill-amber'}`}>
              {subject.hasTouredBefore ? 'Touring act' : 'First tour'}
            </span>
            <span className="pill pill-gray">{miles.toLocaleString()} miles</span>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            Bill: {tour.bands.map(b => (
              <span key={b.id} className={b.id === tour.subjectBandId ? 'text-white' : ''}>
                {b.name}{b.id !== tour.bands[tour.bands.length - 1].id ? ' → ' : ''}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <ExpandableStatCard
            id="revenue"
            label="Total Revenue"
            value={formatCurrency(totals.totalRevenue)}
            expanded={expanded === 'revenue'}
            onToggle={() => toggle('revenue')}
            breakdown={revenueBreakdown}
          />
          <ExpandableStatCard
            id="expenses"
            label="Total Expenses"
            value={formatCurrency(totals.totalExpenses)}
            expanded={expanded === 'expenses'}
            onToggle={() => toggle('expenses')}
            breakdown={expenseBreakdown}
          />
          <StatCard label="Tour Net" value={formatCurrency(totals.tourNet)} positive={totals.tourNet >= 0} />
          <StatCard label="Per Member" value={formatCurrency(totals.perMember)} positive={totals.perMember >= 0} />
          <StatCard label="Risk (mitigated)" value={formatCurrency(totals.riskExpected)} />
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm text-gray-400 mb-2 font-medium">Scenario</div>
        <ScenarioSelector tour={tour} active={scenarioName} onChange={onScenarioChange} />
      </div>
    </header>
  );
}

function StatCard({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="bg-surface-700 rounded-lg px-4 py-3 min-w-[100px] text-center">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-lg font-bold ${
        positive === undefined ? 'text-white' : positive ? 'text-green-400' : 'text-red-400'
      }`}>
        {value}
      </div>
    </div>
  );
}

interface BreakdownItem {
  label: string;
  value: number;
}

function ExpandableStatCard({
  id,
  label,
  value,
  expanded,
  onToggle,
  breakdown,
}: {
  id: string;
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  breakdown: BreakdownItem[];
}) {
  const maxVal = Math.max(...breakdown.map(b => Math.abs(b.value)), 1);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`bg-surface-700 rounded-lg px-4 py-3 min-w-[100px] text-center cursor-pointer border transition-colors ${
          expanded ? 'border-blue-500/50' : 'border-transparent hover:border-surface-500'
        }`}
      >
        <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
          {label}
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className="text-lg font-bold text-white">{value}</div>
      </button>

      {expanded && (
        <div className="absolute top-full left-0 mt-2 z-20 bg-surface-800 border border-surface-600 rounded-lg p-3 min-w-[220px] shadow-xl">
          <div className="space-y-2">
            {breakdown.map(item => (
              <div key={`${id}-${item.label}`}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-200 font-mono">{formatCurrency(item.value)}</span>
                </div>
                <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500/70 rounded-full transition-all"
                    style={{ width: `${Math.max((Math.abs(item.value) / maxVal) * 100, 1)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
