import { useRef, useCallback } from 'react';
import { synestiaSpring2026 } from './data/synestia-spring-2026';
import { useTourEditor } from './hooks/useTourEditor';
import { useScenario } from './hooks/useScenario';
import TourHeader from './components/TourHeader';
import TourToolbar from './components/TourToolbar';
import type { TourToolbarHandle } from './components/TourToolbar';
import PreTourExpenses from './components/PreTourExpenses';
import OngoingExpenses from './components/OngoingExpenses';
import AdditionalRevenueSection from './components/AdditionalRevenue';
import DateBreakdown from './components/DateBreakdown';
import CumulativeChart from './components/CumulativeChart';
import RiskAnalysis from './components/RiskAnalysis';
import MerchPersonComparison from './components/MerchPersonComparison';
import Methodology from './components/Methodology';

export default function App() {
  const editor = useTourEditor(synestiaSpring2026);
  const { tour } = editor;
  const { scenarioName, setScenarioName, results, totals } = useScenario(tour);

  // Section refs for scroll-to-source
  const ongoingExpensesRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<TourToolbarHandle>(null);

  const scrollToOngoingExpenses = useCallback(() => {
    ongoingExpensesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ongoingExpensesRef.current?.classList.add('ring-2', 'ring-blue-500');
    setTimeout(() => ongoingExpensesRef.current?.classList.remove('ring-2', 'ring-blue-500'), 2000);
  }, []);

  const scrollToManagement = useCallback(() => {
    toolbarRef.current?.expandAndScrollToManagement();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <TourHeader
        tour={tour}
        totals={totals}
        scenarioName={scenarioName}
        onScenarioChange={setScenarioName}
        isDirty={editor.isDirty}
      />

      <TourToolbar
        ref={toolbarRef}
        tour={tour}
        scenarioName={scenarioName}
        isDirty={editor.isDirty}
        onUpdateScenario={editor.updateScenario}
        onUpdateManagement={editor.updateManagement}
        onUpdateFuelParams={editor.updateFuelParams}
        onReset={editor.resetToDefaults}
        onExport={editor.exportTour}
        onImport={editor.importTour}
      />

      <PreTourExpenses
        tour={tour}
        onUpdateExpense={editor.updatePreTourExpense}
        onAddExpense={editor.addPreTourExpense}
        onRemoveExpense={editor.removePreTourExpense}
      />

      <div ref={ongoingExpensesRef} className="transition-all duration-500 rounded-lg">
        <OngoingExpenses
          tour={tour}
          onUpdateExpense={editor.updateOngoingExpense}
        />
      </div>

      <AdditionalRevenueSection
        tour={tour}
        onUpdateRevenue={editor.updateAdditionalRevenue}
        onAddRevenue={editor.addAdditionalRevenue}
        onRemoveRevenue={editor.removeAdditionalRevenue}
      />

      <DateBreakdown
        tour={tour}
        results={results}
        totals={totals}
        onUpdateVenue={editor.updateVenue}
        onUpdateLodging={editor.updateLodging}
        onUpdateRouting={editor.updateRouting}
        onUpdateAllVenues={editor.updateAllVenues}
        onUpdateAllLodging={editor.updateAllLodging}
        onAddDate={editor.addDate}
        onRemoveDate={editor.removeDate}
        onScrollToOngoingExpenses={scrollToOngoingExpenses}
        onScrollToManagement={scrollToManagement}
      />

      <CumulativeChart results={results} />

      <RiskAnalysis tour={tour} totals={totals} />

      <MerchPersonComparison totals={totals} numDates={tour.dates.length} />

      <Methodology tour={tour} />

      <footer className="text-center text-xs text-gray-600 py-8 border-t border-surface-700">
        The Take — Tour Economics Forecast Tool. Data compiled from public sources.
        Not financial advice. Model your own numbers.
      </footer>
    </div>
  );
}
