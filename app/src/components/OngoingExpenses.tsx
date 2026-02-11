import type { Tour, OngoingExpense } from '../types';
import { formatCurrency } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  tour: Tour;
  onUpdateExpense: (idx: number, patch: Partial<OngoingExpense>) => void;
}

export default function OngoingExpenses({ tour, onUpdateExpense }: Props) {
  const showDays = tour.dates.length;
  const calendarDays = showDays + tour.offDays.length;

  return (
    <section className="section-card">
      <h2 className="section-title">Daily & Per-Show Costs</h2>
      <p className="text-sm text-gray-400 mb-4">
        Recurring expenses that apply every day or every show. These feed the Per Diem and Crew columns in the date breakdown.
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item</th>
            <th className="text-right">Per Day</th>
            <th className="text-right">Per Show</th>
            <th className="text-right">Headcount</th>
            <th className="text-right">Tour Total</th>
          </tr>
        </thead>
        <tbody>
          {tour.ongoingExpenses.map((exp, i) => {
            const hc = exp.headcount ?? 1;
            const dayTotal = (exp.perDay ?? 0) * hc * calendarDays;
            const showTotal = (exp.perShow ?? 0) * hc * showDays;
            const total = dayTotal + showTotal;

            return (
              <tr key={i}>
                <td className="text-gray-400">{exp.category}</td>
                <td className="text-gray-200">
                    <EditableCell
                      value={exp.label}
                      onChange={(v) => onUpdateExpense(i, { label: String(v) })}
                      type="text"
                    />
                  </td>
                <td className="text-right font-mono text-gray-300">
                  {exp.perDay != null ? (
                    <EditableCell
                      value={exp.perDay}
                      displayValue={formatCurrency(exp.perDay)}
                      onChange={(v) => onUpdateExpense(i, { perDay: v as number })}
                      type="currency"
                    />
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="text-right font-mono text-gray-300">
                  {exp.perShow != null ? (
                    <EditableCell
                      value={exp.perShow}
                      displayValue={formatCurrency(exp.perShow)}
                      onChange={(v) => onUpdateExpense(i, { perShow: v as number })}
                      type="currency"
                    />
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="text-right font-mono text-gray-300">
                  {exp.headcount != null ? (
                    <EditableCell
                      value={exp.headcount}
                      displayValue={String(exp.headcount)}
                      onChange={(v) => onUpdateExpense(i, { headcount: v as number })}
                      min={1}
                    />
                  ) : (
                    <span className="text-gray-600">—</span>
                  )}
                </td>
                <td className="text-right font-mono text-gray-200">{formatCurrency(total)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-surface-600">
            <td colSpan={5} className="font-semibold text-white pt-3">Total Daily/Per-Show Costs</td>
            <td className="text-right font-mono font-bold text-gray-200 pt-3">
              {formatCurrency(
                tour.ongoingExpenses.reduce((sum, exp) => {
                  const hc = exp.headcount ?? 1;
                  return sum + (exp.perDay ?? 0) * hc * calendarDays + (exp.perShow ?? 0) * hc * showDays;
                }, 0)
              )}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>
  );
}
