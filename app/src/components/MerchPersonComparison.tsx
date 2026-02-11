import { useState } from 'react';
import type { TourTotals } from '../types';
import { formatCurrency } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  totals: TourTotals;
  numDates: number;
}

export default function MerchPersonComparison({ totals, numDates }: Props) {
  const [meganCash, setMeganCash] = useState(2000);
  const [meganTips, setMeganTips] = useState(500);
  const [proPerShowLow, setProPerShowLow] = useState(100);
  const [proPerShowHigh, setProPerShowHigh] = useState(200);
  const [trainingCost, setTrainingCost] = useState(250);
  const [proPerDiem, setProPerDiem] = useState(12);
  const [proPerDiemDays, setProPerDiemDays] = useState(28);

  const meganTotal = meganCash + meganTips;
  const proLow = proPerShowLow * numDates;
  const proHigh = proPerShowHigh * numDates;
  const proPerDiemTotal = proPerDiemDays * proPerDiem;

  const costDeltaLow = proLow - meganTotal;
  const costDeltaHigh = proHigh - meganTotal;

  return (
    <section className="section-card">
      <h2 className="section-title">The Merch Person Question</h2>
      <p className="text-sm text-gray-400 mb-4">
        Side-by-side comparison: Megan's offered package vs. hiring an "experienced" professional. Click values to edit.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Megan */}
        <div className="bg-surface-700 rounded-lg p-4 border border-surface-600">
          <h3 className="font-semibold text-white mb-3">Megan's Package</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="text-gray-400 py-1">Cash compensation</td>
                <td className="text-right font-mono py-1 text-gray-200">
                  <EditableCell value={meganCash} displayValue={formatCurrency(meganCash)}
                    onChange={(v) => setMeganCash(v as number)} type="currency" />
                </td>
              </tr>
              <tr>
                <td className="text-gray-400 py-1">Estimated tips</td>
                <td className="text-right font-mono py-1 text-gray-200">
                  <EditableCell value={meganTips} displayValue={formatCurrency(meganTips)}
                    onChange={(v) => setMeganTips(v as number)} type="currency" />
                </td>
              </tr>
              <Row label="Guest performance spot" value="Yes" highlight />
              <Row label="Networking access" value="Yes" highlight />
              <tr>
                <td className="text-gray-400 py-1">Training investment</td>
                <td className="text-right font-mono py-1 text-gray-200">
                  <EditableCell value={trainingCost} displayValue={formatCurrency(trainingCost)}
                    onChange={(v) => setTrainingCost(v as number)} type="currency" />
                </td>
              </tr>
              <tr className="border-t border-surface-600">
                <td className="pt-2 font-semibold text-white">Total band cost</td>
                <td className="pt-2 text-right font-mono font-bold text-white">
                  {formatCurrency(meganTotal + trainingCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Professional */}
        <div className="bg-surface-700 rounded-lg p-4 border border-surface-600">
          <h3 className="font-semibold text-white mb-3">Experienced Professional</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr>
                <td className="text-gray-400 py-1">
                  Cash ($<EditableCell value={proPerShowLow} onChange={(v) => setProPerShowLow(v as number)} type="currency" inputClassName="w-12" />
                  –$<EditableCell value={proPerShowHigh} onChange={(v) => setProPerShowHigh(v as number)} type="currency" inputClassName="w-12" />
                  /show x {numDates})
                </td>
                <td className="text-right font-mono py-1 text-gray-200">
                  {formatCurrency(proLow)}–{formatCurrency(proHigh)}
                </td>
              </tr>
              <tr>
                <td className="text-gray-400 py-1">
                  Per diem (<EditableCell value={proPerDiemDays} onChange={(v) => setProPerDiemDays(v as number)} inputClassName="w-10" /> days x $<EditableCell value={proPerDiem} onChange={(v) => setProPerDiem(v as number)} type="currency" inputClassName="w-10" />)
                </td>
                <td className="text-right font-mono py-1 text-gray-200">
                  {formatCurrency(proPerDiemTotal)}
                </td>
              </tr>
              <Row label="Guest performance spot" value="No" />
              <Row label="Networking value to band" value="None" />
              <Row label="Training investment" value="$0" />
              <tr className="border-t border-surface-600">
                <td className="pt-2 font-semibold text-white">Total band cost</td>
                <td className="pt-2 text-right font-mono font-bold text-white">
                  {formatCurrency(proLow + proPerDiemTotal)}–{formatCurrency(proHigh + proPerDiemTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Delta analysis */}
      <div className="bg-surface-700 rounded-lg p-4 border border-surface-600">
        <h3 className="font-semibold text-white mb-3">Net Financial Analysis</h3>
        <table className="data-table">
          <tbody>
            <tr>
              <td className="text-gray-300">Cost premium for "experience"</td>
              <td className="text-right font-mono text-amber-400">
                {formatCurrency(costDeltaLow + proPerDiemTotal)} – {formatCurrency(costDeltaHigh + proPerDiemTotal)} more
              </td>
            </tr>
            <tr>
              <td className="text-gray-300">Expected risk reduction from experience (mitigated scenario)</td>
              <td className="text-right font-mono text-gray-300">
                {formatCurrency(totals.riskExpected * 0.3)} – {formatCurrency(totals.riskExpected * 0.5)} saved
              </td>
            </tr>
            <tr className="border-t border-surface-600">
              <td className="text-white font-semibold pt-2">Net delta (experienced vs. Megan)</td>
              <td className="text-right font-mono font-bold text-amber-400 pt-2">
                {formatCurrency(-costDeltaLow - proPerDiemTotal + totals.riskExpected * 0.5)} to{' '}
                {formatCurrency(-costDeltaHigh - proPerDiemTotal + totals.riskExpected * 0.3)}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-3">
          The "experienced" hire costs more than the risk they prevent. The net financial outcome of hiring
          Megan is within ~$1,200 in either direction — a rounding error on a {formatCurrency(totals.grossMerch)} gross tour.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr>
      <td className="text-gray-400 py-1">{label}</td>
      <td className={`text-right font-mono py-1 ${highlight ? 'text-green-400' : 'text-gray-200'}`}>{value}</td>
    </tr>
  );
}
