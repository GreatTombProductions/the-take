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

        <div className="flex gap-4 text-center shrink-0">
          <StatCard label="Total Revenue" value={formatCurrency(totals.totalRevenue)} />
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
    <div className="bg-surface-700 rounded-lg px-4 py-3 min-w-[100px]">
      <div className="text-xs text-gray-400">{label}</div>
      <div className={`text-lg font-bold ${
        positive === undefined ? 'text-white' : positive ? 'text-green-400' : 'text-red-400'
      }`}>
        {value}
      </div>
    </div>
  );
}
