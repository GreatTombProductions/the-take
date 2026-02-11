import { useState, useMemo } from 'react';
import type { Tour, ScenarioName, DateResult, TourTotals } from '../types';
import { computeTourResults, computeTourTotals } from '../engine';

export function useScenario(tour: Tour) {
  const [scenarioName, setScenarioName] = useState<ScenarioName>('mid');

  const results = useMemo(() => computeTourResults(tour, scenarioName), [tour, scenarioName]);
  const totals = useMemo(() => computeTourTotals(tour, scenarioName, results), [tour, scenarioName, results]);
  const scenario = tour.scenarios[scenarioName];

  return { scenarioName, setScenarioName, scenario, results, totals };
}
