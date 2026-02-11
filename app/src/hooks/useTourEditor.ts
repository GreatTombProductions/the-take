import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Tour, TourDate, Venue, RoutingLeg, LodgingEstimate,
  Expense, OngoingExpense, AdditionalRevenue, ScenarioName, ScenarioParams,
  ManagementTerms, FuelParams,
} from '../types';

const STORAGE_KEY_PREFIX = 'the-take:';

function getStorageKey(tourId: string): string {
  return `${STORAGE_KEY_PREFIX}${tourId}:editor`;
}

function loadState(tourId: string, defaults: Tour): Tour {
  try {
    const stored = localStorage.getItem(getStorageKey(tourId));
    if (stored) return JSON.parse(stored);
  } catch {}
  return structuredClone(defaults);
}

function saveState(tourId: string, state: Tour): void {
  try {
    localStorage.setItem(getStorageKey(tourId), JSON.stringify(state));
  } catch {}
}

export function useTourEditor(defaults: Tour) {
  const defaultsRef = useRef(defaults);
  const [tour, setTour] = useState<Tour>(() => loadState(defaults.id, defaults));

  useEffect(() => {
    saveState(tour.id, tour);
  }, [tour]);

  const isDirty = JSON.stringify(tour) !== JSON.stringify(defaultsRef.current);

  // --- Date-level updaters ---

  const updateVenue = useCallback((dateIndex: number, patch: Partial<Venue>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d =>
        d.index === dateIndex ? { ...d, venue: { ...d.venue, ...patch } } : d
      ),
    }));
  }, []);

  const updateRouting = useCallback((dateIndex: number, patch: Partial<RoutingLeg>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d =>
        d.index === dateIndex ? { ...d, routing: { ...d.routing, ...patch } } : d
      ),
    }));
  }, []);

  const updateLodging = useCallback((dateIndex: number, patch: Partial<LodgingEstimate>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d =>
        d.index === dateIndex ? { ...d, lodging: { ...d.lodging, ...patch } } : d
      ),
    }));
  }, []);

  const updateDate = useCallback((dateIndex: number, patch: Partial<TourDate>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d =>
        d.index === dateIndex ? { ...d, ...patch } : d
      ),
    }));
  }, []);

  const updateAllDates = useCallback((patch: Partial<TourDate>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d => ({ ...d, ...patch })),
    }));
  }, []);

  const addDate = useCallback((date: TourDate) => {
    setTour(prev => ({
      ...prev,
      dates: [...prev.dates, date],
    }));
  }, []);

  const removeDate = useCallback((dateIndex: number) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.filter(d => d.index !== dateIndex),
    }));
  }, []);

  // --- Pre-tour expenses ---

  const updatePreTourExpense = useCallback((idx: number, patch: Partial<Expense>) => {
    setTour(prev => ({
      ...prev,
      preTourExpenses: prev.preTourExpenses.map((e, i) =>
        i === idx ? { ...e, ...patch } : e
      ),
    }));
  }, []);

  const addPreTourExpense = useCallback((expense: Expense) => {
    setTour(prev => ({
      ...prev,
      preTourExpenses: [...prev.preTourExpenses, expense],
    }));
  }, []);

  const removePreTourExpense = useCallback((idx: number) => {
    setTour(prev => ({
      ...prev,
      preTourExpenses: prev.preTourExpenses.filter((_, i) => i !== idx),
    }));
  }, []);

  // --- Ongoing expenses ---

  const updateOngoingExpense = useCallback((idx: number, patch: Partial<OngoingExpense>) => {
    setTour(prev => ({
      ...prev,
      ongoingExpenses: prev.ongoingExpenses.map((e, i) =>
        i === idx ? { ...e, ...patch } : e
      ),
    }));
  }, []);

  // --- Additional revenue ---

  const updateAdditionalRevenue = useCallback((idx: number, patch: Partial<AdditionalRevenue>) => {
    setTour(prev => ({
      ...prev,
      additionalRevenue: (prev.additionalRevenue ?? []).map((r, i) =>
        i === idx ? { ...r, ...patch } : r
      ),
    }));
  }, []);

  const addAdditionalRevenue = useCallback((revenue: AdditionalRevenue) => {
    setTour(prev => ({
      ...prev,
      additionalRevenue: [...(prev.additionalRevenue ?? []), revenue],
    }));
  }, []);

  const removeAdditionalRevenue = useCallback((idx: number) => {
    setTour(prev => ({
      ...prev,
      additionalRevenue: (prev.additionalRevenue ?? []).filter((_, i) => i !== idx),
    }));
  }, []);

  // --- Batch updaters (Edit All) ---

  const updateAllVenues = useCallback((patch: Partial<Venue>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d => ({ ...d, venue: { ...d.venue, ...patch } })),
    }));
  }, []);

  const updateAllLodging = useCallback((patch: Partial<LodgingEstimate>) => {
    setTour(prev => ({
      ...prev,
      dates: prev.dates.map(d => ({ ...d, lodging: { ...d.lodging, ...patch } })),
    }));
  }, []);

  // --- Scenario params ---

  const updateScenario = useCallback((name: ScenarioName, patch: Partial<ScenarioParams>) => {
    setTour(prev => ({
      ...prev,
      scenarios: {
        ...prev.scenarios,
        [name]: { ...prev.scenarios[name], ...patch },
      },
    }));
  }, []);

  // --- Management ---

  const updateManagement = useCallback((patch: Partial<ManagementTerms>) => {
    setTour(prev => ({
      ...prev,
      management: { ...prev.management, ...patch },
    }));
  }, []);

  // --- Fuel ---

  const updateFuelParams = useCallback((patch: Partial<FuelParams>) => {
    setTour(prev => ({
      ...prev,
      fuelParams: { ...prev.fuelParams, ...patch },
    }));
  }, []);

  // --- Import / Export / Reset ---

  const resetToDefaults = useCallback(() => {
    const fresh = structuredClone(defaultsRef.current);
    setTour(fresh);
    try { localStorage.removeItem(getStorageKey(fresh.id)); } catch {}
  }, []);

  const exportTour = useCallback(() => {
    const blob = new Blob([JSON.stringify(tour, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `the-take-${tour.id}-settings.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tour]);

  const importTour = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Tour;
        if (imported.id && imported.dates && imported.scenarios) {
          setTour(imported);
        }
      } catch {}
    };
    reader.readAsText(file);
  }, []);

  return {
    tour,
    isDirty,
    updateVenue,
    updateRouting,
    updateLodging,
    updateDate,
    updateAllDates,
    addDate,
    removeDate,
    updatePreTourExpense,
    addPreTourExpense,
    removePreTourExpense,
    updateOngoingExpense,
    updateAdditionalRevenue,
    addAdditionalRevenue,
    removeAdditionalRevenue,
    updateAllVenues,
    updateAllLodging,
    updateScenario,
    updateManagement,
    updateFuelParams,
    resetToDefaults,
    exportTour,
    importTour,
  };
}
