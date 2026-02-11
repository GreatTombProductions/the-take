import { useState } from 'react';
import type { Tour, Expense } from '../types';
import { formatCurrency, totalPreTourExpenses } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  tour: Tour;
  onUpdateExpense: (idx: number, patch: Partial<Expense>) => void;
  onAddExpense: (expense: Expense) => void;
  onRemoveExpense: (idx: number) => void;
}

export default function PreTourExpenses({ tour, onUpdateExpense, onAddExpense, onRemoveExpense }: Props) {
  const total = totalPreTourExpenses(tour);
  const [adding, setAdding] = useState(false);

  return (
    <section className="section-card">
      <h2 className="section-title">Pre-Tour Investment</h2>
      <p className="text-sm text-gray-400 mb-4">
        Capital committed before show 1. Click any value to edit.
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Item</th>
            <th className="text-right">Amount</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tour.preTourExpenses.map((exp, i) => (
            <tr key={i} className="group">
              <td className="text-gray-400">
                <EditableCell
                  value={exp.category}
                  onChange={(v) => onUpdateExpense(i, { category: v as string })}
                  type="text"
                />
              </td>
              <td className="text-gray-200">
                <EditableCell
                  value={exp.label}
                  onChange={(v) => onUpdateExpense(i, { label: v as string })}
                  type="text"
                />
              </td>
              <td className="text-right font-mono text-gray-200">
                <EditableCell
                  value={exp.amount}
                  displayValue={formatCurrency(exp.amount)}
                  onChange={(v) => onUpdateExpense(i, { amount: v as number })}
                  type="currency"
                  min={0}
                />
              </td>
              <td className="text-gray-500 text-xs">
                <EditableCell
                  value={exp.note}
                  onChange={(v) => onUpdateExpense(i, { note: v as string })}
                  type="text"
                />
              </td>
              <td className="text-center">
                <button
                  onClick={() => { if (confirm(`Remove "${exp.label}"?`)) onRemoveExpense(i); }}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 text-xs px-1"
                  title="Remove expense"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-surface-600">
            <td colSpan={2} className="font-semibold text-white pt-3">Total Pre-Tour Investment</td>
            <td className="text-right font-mono font-bold text-red-400 pt-3">{formatCurrency(total)}</td>
            <td colSpan={2} className="pt-3"></td>
          </tr>
        </tfoot>
      </table>

      {adding ? (
        <AddExpenseForm
          onAdd={(expense) => { onAddExpense(expense); setAdding(false); }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-4 px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
        >
          + Add Expense
        </button>
      )}
    </section>
  );
}

function AddExpenseForm({ onAdd, onCancel }: { onAdd: (e: Expense) => void; onCancel: () => void }) {
  const [category, setCategory] = useState('');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState('');

  const submit = () => {
    if (!label) return;
    onAdd({ category, label, amount, note });
  };

  return (
    <div className="mt-4 bg-surface-700 rounded-lg p-4 border border-surface-600">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input placeholder="Item label" value={label} onChange={e => setLabel(e.target.value)}
          className="bg-surface-900 border border-surface-600 rounded px-2 py-1 text-gray-200 focus:border-blue-500 focus:outline-none" />
        <input type="number" placeholder="Amount" value={amount} onChange={e => setAmount(Number(e.target.value))}
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
