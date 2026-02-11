import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import type { Tour, ScenarioName, ScenarioParams, ManagementTerms, FuelParams } from '../types';
import { formatPct } from '../engine';
import EditableCell from './EditableCell';

interface Props {
  tour: Tour;
  scenarioName: ScenarioName;
  isDirty: boolean;
  onUpdateScenario: (name: ScenarioName, patch: Partial<ScenarioParams>) => void;
  onUpdateManagement: (patch: Partial<ManagementTerms>) => void;
  onUpdateFuelParams: (patch: Partial<FuelParams>) => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
}

export interface TourToolbarHandle {
  expandAndScrollToManagement: () => void;
}

const TourToolbar = forwardRef<TourToolbarHandle, Props>(function TourToolbar({
  tour, scenarioName, isDirty,
  onUpdateScenario, onUpdateManagement, onUpdateFuelParams,
  onReset, onExport, onImport,
}, ref) {
  const [showParams, setShowParams] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const managementRef = useRef<HTMLDivElement>(null);
  const scenario = tour.scenarios[scenarioName];
  const mgmt = tour.management;
  const fuel = tour.fuelParams;

  useImperativeHandle(ref, () => ({
    expandAndScrollToManagement: () => {
      setShowParams(true);
      // Wait for render, then scroll + highlight
      setTimeout(() => {
        managementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        managementRef.current?.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => managementRef.current?.classList.remove('ring-2', 'ring-blue-500'), 2000);
      }, 100);
    },
  }));

  return (
    <section className="section-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowParams(!showParams)}
            className="px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
          >
            {showParams ? 'Hide' : 'Show'} Parameters
          </button>
          <button
            onClick={onExport}
            className="px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
          >
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 text-xs bg-surface-700 border border-surface-600 rounded hover:bg-surface-600 text-gray-300"
          >
            Import
          </button>
          {isDirty && (
            <button
              onClick={() => { if (confirm('Reset all values to defaults?')) onReset(); }}
              className="px-3 py-1.5 text-xs bg-red-900/30 border border-red-900/50 rounded hover:bg-red-900/50 text-red-400"
            >
              Reset to Defaults
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
            }}
          />
        </div>
        {isDirty && <span className="pill pill-amber">Modified</span>}
      </div>

      {showParams && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Scenario params */}
          <div className="bg-surface-700 rounded-lg p-4 border border-surface-600">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Scenario: {scenario.label}
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <ParamRow label="Conversion Rate">
                  <EditableCell
                    value={scenario.conversionRate}
                    displayValue={formatPct(scenario.conversionRate)}
                    onChange={(v) => onUpdateScenario(scenarioName, { conversionRate: v as number })}
                    type="percent"
                    step={0.1}
                  />
                </ParamRow>
                <ParamRow label="Avg Transaction">
                  <EditableCell
                    value={scenario.avgTransactionValue}
                    displayValue={`$${scenario.avgTransactionValue}`}
                    onChange={(v) => onUpdateScenario(scenarioName, { avgTransactionValue: v as number })}
                    type="currency"
                  />
                </ParamRow>
                <ParamRow label="Attendance Mult">
                  <EditableCell
                    value={scenario.attendanceMultiplier}
                    displayValue={`${scenario.attendanceMultiplier}x`}
                    onChange={(v) => onUpdateScenario(scenarioName, { attendanceMultiplier: v as number })}
                    step={0.05}
                  />
                </ParamRow>
                <tr>
                  <td className="text-gray-400 py-1">Max Capacity</td>
                  <td className="text-right py-1">
                    <input
                      type="checkbox"
                      checked={scenario.useMaxCapacity ?? false}
                      onChange={(e) => onUpdateScenario(scenarioName, { useMaxCapacity: e.target.checked })}
                      className="accent-blue-500"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Management */}
          <div ref={managementRef} className="bg-surface-700 rounded-lg p-4 border border-surface-600 transition-all duration-500">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Management</h3>
            <table className="w-full text-sm">
              <tbody>
                <ParamRow label="Mgmt Cut">
                  <EditableCell
                    value={mgmt.cutPct}
                    displayValue={formatPct(mgmt.cutPct)}
                    onChange={(v) => onUpdateManagement({ cutPct: v as number })}
                    type="percent"
                    step={0.5}
                  />
                </ParamRow>
                <ParamRow label="Applied To">
                  <select
                    value={mgmt.appliedTo}
                    onChange={(e) => onUpdateManagement({ appliedTo: e.target.value as 'gross' | 'net' })}
                    className="bg-surface-900 border border-surface-600 rounded px-1 py-0 text-sm text-gray-200 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="gross">Gross</option>
                    <option value="net">Net</option>
                  </select>
                </ParamRow>
                <ParamRow label="Show Guarantee">
                  <EditableCell
                    value={mgmt.showGuarantee}
                    displayValue={`$${mgmt.showGuarantee}`}
                    onChange={(v) => onUpdateManagement({ showGuarantee: v as number })}
                    type="currency"
                  />
                </ParamRow>
                <ParamRow label="Booking Agent">
                  <EditableCell
                    value={mgmt.bookingAgentPct}
                    displayValue={formatPct(mgmt.bookingAgentPct)}
                    onChange={(v) => onUpdateManagement({ bookingAgentPct: v as number })}
                    type="percent"
                    step={0.5}
                  />
                </ParamRow>
              </tbody>
            </table>
          </div>

          {/* Fuel */}
          <div className="bg-surface-700 rounded-lg p-4 border border-surface-600">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Fuel</h3>
            <table className="w-full text-sm">
              <tbody>
                <ParamRow label="MPG Low">
                  <EditableCell
                    value={fuel.mpgLow}
                    displayValue={String(fuel.mpgLow)}
                    onChange={(v) => onUpdateFuelParams({ mpgLow: v as number })}
                    step={0.5}
                  />
                </ParamRow>
                <ParamRow label="MPG High">
                  <EditableCell
                    value={fuel.mpgHigh}
                    displayValue={String(fuel.mpgHigh)}
                    onChange={(v) => onUpdateFuelParams({ mpgHigh: v as number })}
                    step={0.5}
                  />
                </ParamRow>
                <ParamRow label="Fuel Price">
                  <EditableCell
                    value={fuel.fuelPricePerGallon}
                    displayValue={`$${fuel.fuelPricePerGallon.toFixed(2)}`}
                    onChange={(v) => onUpdateFuelParams({ fuelPricePerGallon: v as number })}
                    type="currency"
                    step={0.05}
                  />
                </ParamRow>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
});

export default TourToolbar;

function ParamRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr>
      <td className="text-gray-400 py-1">{label}</td>
      <td className="text-right font-mono py-1 text-gray-200">{children}</td>
    </tr>
  );
}
