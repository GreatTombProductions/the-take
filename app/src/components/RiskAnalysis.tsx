import type { Tour, TourTotals } from '../types';
import { formatCurrency, formatPct, estimateTourRisk } from '../engine';

interface Props {
  tour: Tour;
  totals: TourTotals;
}

export default function RiskAnalysis({ tour, totals }: Props) {
  const unmitigated = estimateTourRisk(tour.riskProfile, tour.dates.length, false);
  const mitigated = estimateTourRisk(tour.riskProfile, tour.dates.length, true);

  return (
    <section className="section-card">
      <h2 className="section-title">Risk Analysis</h2>
      <p className="text-sm text-gray-400 mb-4">
        Quantified risk from merch operations, by category. "Experience Relevance" indicates how much
        prior experience reduces the risk vs. training + technology.
      </p>

      {/* Comparison callout */}
      <div className="bg-surface-700 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-6">
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">Sam's Claimed Risk</div>
          <div className="text-2xl font-bold text-red-400">$30,000 – $50,000</div>
          <div className="text-xs text-gray-500 mt-1">Source: Sam's message, attributed to management</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">Model Risk (mitigated, {tour.dates.length} dates)</div>
          <div className="text-2xl font-bold text-green-400">
            {formatCurrency(mitigated.range[0])} – {formatCurrency(mitigated.range[1])}
          </div>
          <div className="text-xs text-gray-500 mt-1">Expected: {formatCurrency(mitigated.expected)}</div>
        </div>
        <div className="flex-1">
          <div className="text-xs text-gray-400 mb-1">Model Risk (unmitigated)</div>
          <div className="text-2xl font-bold text-amber-400">
            {formatCurrency(unmitigated.range[0])} – {formatCurrency(unmitigated.range[1])}
          </div>
          <div className="text-xs text-gray-500 mt-1">Expected: {formatCurrency(unmitigated.expected)}</div>
        </div>
      </div>

      <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-3 mb-6 text-sm text-red-300">
        Even the <em>unmitigated</em> worst case ({formatCurrency(unmitigated.range[1])}) is{' '}
        {((50_000 - unmitigated.range[1]) / 50_000 * 100).toFixed(0)}% below Sam's lower bound.
        The $30-50K claim does not survive arithmetic at Synestia's scale.
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Risk Category</th>
            <th className="text-right">P(per show)</th>
            <th className="text-right">Exposure Range</th>
            <th className="text-center">Exp. Relevance</th>
            <th className="text-right">With Mitigation</th>
            <th className="text-right">Tour Expected</th>
            <th>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          {tour.riskProfile.map((risk) => {
            const tourExpected = risk.probabilityPerShow *
              ((risk.withMitigationRange[0] + risk.withMitigationRange[1]) / 2) *
              tour.dates.length;

            return (
              <tr key={risk.id}>
                <td className="text-gray-200 font-medium">{risk.name}</td>
                <td className="text-right font-mono text-gray-300">{formatPct(risk.probabilityPerShow)}</td>
                <td className="text-right font-mono text-gray-400">
                  {formatCurrency(risk.exposureRange[0])}–{formatCurrency(risk.exposureRange[1])}
                </td>
                <td className="text-center">
                  <span className={`pill ${
                    risk.experienceRelevance === 'none' ? 'pill-green' :
                    risk.experienceRelevance === 'low' ? 'pill-blue' :
                    'pill-amber'
                  }`}>
                    {risk.experienceRelevance}
                  </span>
                </td>
                <td className="text-right font-mono text-gray-300">
                  {formatCurrency(risk.withMitigationRange[0])}–{formatCurrency(risk.withMitigationRange[1])}
                </td>
                <td className="text-right font-mono text-gray-200">{formatCurrency(tourExpected)}</td>
                <td className="text-gray-500 text-xs max-w-[200px] truncate" title={risk.mitigationNote}>
                  {risk.mitigationNote}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-surface-600">
            <td className="font-semibold text-white pt-3">Total (mitigated)</td>
            <td colSpan={4}></td>
            <td className="text-right font-mono font-bold text-green-400 pt-3">
              {formatCurrency(mitigated.expected)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      <p className="text-xs text-gray-500 mt-4">
        Risk as % of gross merch ({formatCurrency(totals.grossMerch)}):{' '}
        <span className="text-gray-300">{formatPct(mitigated.expected / totals.grossMerch)}</span> mitigated,{' '}
        <span className="text-gray-300">{formatPct(unmitigated.expected / totals.grossMerch)}</span> unmitigated.
        Industry standard retail shrinkage is 1.4-1.6%.
      </p>
    </section>
  );
}
