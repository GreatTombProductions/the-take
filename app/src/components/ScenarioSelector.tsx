import type { ScenarioName, Tour } from '../types';

interface Props {
  tour: Tour;
  active: ScenarioName;
  onChange: (s: ScenarioName) => void;
}

const SCENARIOS: ScenarioName[] = ['conservative', 'mid', 'steelman'];

export default function ScenarioSelector({ tour, active, onChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {SCENARIOS.map((name) => {
        const s = tour.scenarios[name];
        const isActive = name === active;
        return (
          <button
            key={name}
            onClick={() => onChange(name)}
            className={`flex-1 px-4 py-3 rounded-lg border text-left transition-all ${
              isActive
                ? 'border-accent-blue bg-blue-900/20 text-white'
                : 'border-surface-600 bg-surface-800 text-gray-400 hover:border-gray-500'
            }`}
          >
            <div className="font-semibold text-sm">{s.label}</div>
            <div className="text-xs mt-1 opacity-70">{s.description}</div>
          </button>
        );
      })}
    </div>
  );
}
