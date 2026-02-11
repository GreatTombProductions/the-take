import type { Tour } from '../types';

interface Props {
  tour: Tour;
}

// Map confidence data elements to source sections
const ELEMENT_SOURCE_MAP: Record<string, string[]> = {
  'Tour routing and dates': ['Tour Data'],
  'Venue capacities': ['Tour Data'],
  'Merch catalog + pricing': ['Merch Catalog'],
  'COGS / production costs': ['Revenue Model'],
  'Merch conversion rates (opener)': ['Revenue Model'],
  'Tour expense model': ['Expense Model'],
  'Risk quantification': [],
  'Routing mileage': [],
  '$30-50K claim debunking': [],
};

const CONFIDENCE_DATA: [string, string][] = [
  ['Tour routing and dates', 'Confirmed via multiple sources'],
  ['Venue capacities', '17/21 directly confirmed, 4 estimated'],
  ['Merch catalog + pricing', 'Directly from IndieMerchStore'],
  ['COGS / production costs', 'Well-documented industry data'],
  ['Merch conversion rates (opener)', 'Opener-specific data is thin; ranges account for uncertainty'],
  ['Tour expense model', 'Categories well-documented; amounts are estimated ranges'],
  ['Risk quantification', 'Based on industry descriptions + inference; no actuarial merch data exists'],
  ['Routing mileage', 'Geographic estimates, not GPS-verified'],
  ['$30-50K claim debunking', 'Basic arithmetic makes the claim untenable at this scale'],
];

export default function Methodology({ tour }: Props) {
  const sourcesBySection: Record<string, typeof tour.metadata.sources> = {};
  for (const source of tour.metadata.sources) {
    (sourcesBySection[source.section] ??= []).push(source);
  }

  return (
    <section className="section-card">
      <h2 className="section-title">Methodology & Sources</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">How This Model Works</h3>
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              <strong className="text-gray-300">Revenue:</strong> Per-venue attendance = capacity x attendance rate x scenario multiplier.
              Merch buyers = attendance x conversion rate. Gross = buyers x avg transaction value.
              Net = gross - venue cut - COGS - management cut.
            </p>
            <p>
              <strong className="text-gray-300">Expenses:</strong> Fuel = miles / avg MPG x fuel price. Lodging and per diem
              estimated per date. Pre-tour expenses (inventory, vehicle, insurance) amortized as day-1 sunk cost.
              Off-day expenses (per diem, misc) computed separately.
            </p>
            <p>
              <strong className="text-gray-300">Risk:</strong> Per-category probability x exposure range x number of dates.
              "Mitigated" assumes POS system (Square), count sheets, written procedures, and 1 day of training.
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Key Assumptions</h3>
          <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
            <li>Synestia handles their own merch (no third-party merch company taking a cut)</li>
            <li>Venue merch cuts estimated at 10-25% depending on venue (0% at some smaller clubs)</li>
            <li>Management cut at 15% of gross (industry standard low end for Scott Lee's tier)</li>
            <li>Booking handled by management — no additional booking agent fee</li>
            <li>Show guarantees estimated at $50-$250/show ($140 avg), scaled by market size, venue capacity, and day of week — reflects SL Management's leverage as a package deal with the headliner</li>
            <li>Merch catalog prices from IndieMerchStore (synestia.indiemerch.com)</li>
            <li>Routing mileage estimated from geographic knowledge; ±10% variance expected</li>
            <li>Lodging defaults to camper ($0) — editable per date if hotels needed</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-2">Data Elements & Sources</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Data Element</th>
                <th>Notes</th>
                <th>Sources</th>
              </tr>
            </thead>
            <tbody>
              {CONFIDENCE_DATA.map(([element, notes], i) => {
                const sections = ELEMENT_SOURCE_MAP[element] ?? [];
                const sources = sections.flatMap(s => sourcesBySection[s] ?? []);

                return (
                  <tr key={i}>
                    <td className="text-gray-300">{element}</td>
                    <td className="text-gray-500 text-xs">{notes}</td>
                    <td className="text-xs">
                      {sources.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {sources.map((source, j) => (
                            <a
                              key={j}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 hover:underline"
                              title={source.label}
                            >
                              {source.label}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Remaining sources not covered by the element map */}
        {(() => {
          const coveredSections = new Set(Object.values(ELEMENT_SOURCE_MAP).flat());
          const uncovered = Object.entries(sourcesBySection).filter(([s]) => !coveredSections.has(s));
          if (uncovered.length === 0) return null;
          return (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Additional Sources</h3>
              {uncovered.map(([section, sources]) => (
                <div key={section} className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">{section}</div>
                  <ul className="space-y-1">
                    {sources.map((source, i) => (
                      <li key={i} className="text-sm">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          );
        })()}

        <div className="text-xs text-gray-600 border-t border-surface-600 pt-4">
          Last updated: {tour.metadata.lastUpdated}. {tour.metadata.notes}
        </div>
      </div>
    </section>
  );
}
