import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import type { DateResult } from '../types';
import { formatCurrency } from '../engine';

interface Props {
  results: DateResult[];
}

export default function CumulativeChart({ results }: Props) {
  const data = results.map(r => ({
    name: `${r.date.city} (${formatDateShort(r.date.date)})`,
    cumulative: r.cumulativeNet,
    dayNet: r.dateNet,
  }));

  return (
    <section className="section-card">
      <h2 className="section-title">Cumulative P&L</h2>
      <p className="text-sm text-gray-400 mb-4">
        Running net profit/loss across the tour. Starts negative from pre-tour investment.
      </p>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222230" />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={80}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(v: number) => formatCurrency(v)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a25', border: '1px solid #222230', borderRadius: '8px' }}
              labelStyle={{ color: '#9ca3af' }}
              formatter={(value: number, name: string) => [
                formatCurrency(value),
                name === 'cumulative' ? 'Cumulative Net' : 'Day Net',
              ]}
            />
            <ReferenceLine y={0} stroke="#4b5563" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
