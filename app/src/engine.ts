import type {
  Tour,
  TourDate,
  ScenarioParams,
  ScenarioName,
  Band,
  DateRevenue,
  DateExpenses,
  DateResult,
  TourTotals,
  RiskCategory,
} from './types';

// --- Revenue ---

export function estimateDateRevenue(
  date: TourDate,
  scenario: ScenarioParams,
  band: Band,
  mgmtCutPct: number,
  showGuarantee: number,
): DateRevenue {
  const { venue } = date;
  const attendance = scenario.useMaxCapacity
    ? venue.capacity
    : Math.round(venue.capacity * venue.estimatedAttendanceRate * scenario.attendanceMultiplier);
  const buyers = Math.round(attendance * scenario.conversionRate);
  const merchGross = buyers * scenario.avgTransactionValue;
  const venueCut = merchGross * venue.merchCutPct;
  const cogsPct = computeBlendedCogsPct(band);
  const cogs = merchGross * cogsPct;
  const mgmtCut = merchGross * mgmtCutPct;
  const netMerch = merchGross - venueCut - cogs - mgmtCut;

  return {
    attendance,
    merchGross: round2(merchGross),
    venueCut: round2(venueCut),
    cogs: round2(cogs),
    mgmtCut: round2(mgmtCut),
    netMerch: round2(netMerch),
    showGuarantee,
  };
}

function computeBlendedCogsPct(band: Band): number {
  if (band.merchCatalog.length === 0) return 0.35;
  const totalRetail = band.merchCatalog.reduce((sum, item) => sum + item.retailPrice * item.unitsOnHand, 0);
  const totalCogs = band.merchCatalog.reduce((sum, item) => sum + item.cogs * item.unitsOnHand, 0);
  return totalRetail > 0 ? totalCogs / totalRetail : 0.35;
}

// --- Expenses ---

export function estimateDateExpenses(
  date: TourDate,
  tour: Tour,
): DateExpenses {
  const fuelMpg = (tour.fuelParams.mpgLow + tour.fuelParams.mpgHigh) / 2;
  const fuel = round2((date.routing.miles / fuelMpg) * tour.fuelParams.fuelPricePerGallon);
  const lodging = date.lodging.estimatedCost;

  let perDiem = 0;
  let merchPerson = 0;
  for (const exp of tour.ongoingExpenses) {
    if (exp.perDay) {
      perDiem += exp.perDay * (exp.headcount ?? 1);
    }
    if (exp.perShow) {
      merchPerson += exp.perShow * (exp.headcount ?? 1);
    }
  }

  return {
    fuel,
    lodging,
    perDiem: round2(perDiem),
    merchPerson: round2(merchPerson),
    total: round2(fuel + lodging + perDiem + merchPerson),
  };
}

export function computeOffDayExpenses(tour: Tour): number {
  const offDayCount = tour.offDays.length;
  let perDiemPerDay = 0;
  let miscPerDay = 0;
  for (const exp of tour.ongoingExpenses) {
    if (exp.perDay && exp.category === 'Per Diem') {
      perDiemPerDay += exp.perDay * (exp.headcount ?? 1);
    }
    if (exp.perDay && exp.category === 'Misc') {
      miscPerDay += exp.perDay * (exp.headcount ?? 1);
    }
  }
  return round2(offDayCount * (perDiemPerDay + miscPerDay));
}

// --- Risk ---

export function estimateTourRisk(
  riskProfile: RiskCategory[],
  numDates: number,
  mitigated: boolean,
): { expected: number; range: [number, number] } {
  let totalExpected = 0;
  let totalLow = 0;
  let totalHigh = 0;

  for (const risk of riskProfile) {
    const [low, high] = mitigated ? risk.withMitigationRange : risk.exposureRange;
    const expectedPerShow = risk.probabilityPerShow * ((low + high) / 2);
    totalExpected += expectedPerShow * numDates;
    totalLow += risk.probabilityPerShow * low * numDates;
    totalHigh += risk.probabilityPerShow * high * numDates;
  }

  return {
    expected: round2(totalExpected),
    range: [round2(totalLow), round2(totalHigh)],
  };
}

export function estimateDateRisk(
  riskProfile: RiskCategory[],
  mitigated: boolean,
): { expected: number; range: [number, number] } {
  return estimateTourRisk(riskProfile, 1, mitigated);
}

// --- Full Tour Calculation ---

export function computeTourResults(
  tour: Tour,
  scenarioName: ScenarioName,
): DateResult[] {
  const scenario = tour.scenarios[scenarioName];
  const band = tour.bands.find(b => b.id === tour.subjectBandId)!;
  const results: DateResult[] = [];
  let cumulative = -totalPreTourExpenses(tour); // start negative from pre-tour investment

  // Per-tour additional revenue spread across first date; per-show added each date
  const perTourAddlRev = (tour.additionalRevenue ?? [])
    .filter(r => r.frequency === 'per_tour')
    .reduce((sum, r) => sum + r.amount, 0);
  const perShowAddlRev = (tour.additionalRevenue ?? [])
    .filter(r => r.frequency === 'per_show')
    .reduce((sum, r) => sum + r.amount, 0);

  for (const date of tour.dates) {
    const revenue = estimateDateRevenue(date, scenario, band, tour.management.cutPct, tour.management.showGuarantee);
    const expenses = estimateDateExpenses(date, tour);
    const addlRevForDate = perShowAddlRev + (date.index === tour.dates[0]?.index ? perTourAddlRev : 0);
    const dateNet = revenue.netMerch + revenue.showGuarantee + addlRevForDate - expenses.total;
    cumulative += dateNet;

    results.push({
      date,
      revenue,
      expenses,
      dateNet: round2(dateNet),
      cumulativeNet: round2(cumulative),
    });
  }

  // Subtract off-day expenses from cumulative (spread across last result)
  const offDayExp = computeOffDayExpenses(tour);
  if (results.length > 0) {
    results[results.length - 1].cumulativeNet = round2(
      results[results.length - 1].cumulativeNet - offDayExp,
    );
  }

  return results;
}

export function computeTourTotals(
  tour: Tour,
  scenarioName: ScenarioName,
  results: DateResult[],
): TourTotals {
  const band = tour.bands.find(b => b.id === tour.subjectBandId)!;
  const preTour = totalPreTourExpenses(tour);
  const offDayExp = computeOffDayExpenses(tour);

  const addlRev = totalAdditionalRevenue(tour);

  const totals: TourTotals = {
    grossMerch: 0,
    venueCuts: 0,
    cogs: 0,
    mgmtCuts: 0,
    netMerch: 0,
    showGuarantees: 0,
    additionalRevenue: addlRev,
    totalRevenue: 0,
    totalExpenses: 0,
    preTourExpenses: preTour,
    tourNet: 0,
    perMember: 0,
    riskExpected: 0,
    riskRange: [0, 0],
  };

  for (const r of results) {
    totals.grossMerch += r.revenue.merchGross;
    totals.venueCuts += r.revenue.venueCut;
    totals.cogs += r.revenue.cogs;
    totals.mgmtCuts += r.revenue.mgmtCut;
    totals.netMerch += r.revenue.netMerch;
    totals.showGuarantees += r.revenue.showGuarantee;
    totals.totalExpenses += r.expenses.total;
  }

  totals.totalExpenses += preTour + offDayExp;
  totals.totalRevenue = round2(totals.grossMerch + totals.showGuarantees + addlRev);

  // tourNet = netMerch + showGuarantees + additionalRevenue - all expenses (show-day + pre-tour + off-day)
  totals.tourNet = round2(totals.netMerch + totals.showGuarantees + addlRev - totals.totalExpenses);
  totals.perMember = round2(totals.tourNet / (band.members || 1));

  const risk = estimateTourRisk(tour.riskProfile, tour.dates.length, true);
  totals.riskExpected = risk.expected;
  totals.riskRange = risk.range;

  // Round accumulated totals
  totals.grossMerch = round2(totals.grossMerch);
  totals.venueCuts = round2(totals.venueCuts);
  totals.cogs = round2(totals.cogs);
  totals.mgmtCuts = round2(totals.mgmtCuts);
  totals.netMerch = round2(totals.netMerch);
  totals.totalExpenses = round2(totals.totalExpenses);

  return totals;
}

// --- Additional Revenue ---

export function totalAdditionalRevenue(tour: Tour): number {
  return round2((tour.additionalRevenue ?? []).reduce((sum, r) => {
    if (r.frequency === 'per_show') return sum + r.amount * tour.dates.length;
    return sum + r.amount; // per_tour
  }, 0));
}

// --- Helpers ---

export function totalPreTourExpenses(tour: Tour): number {
  return round2(tour.preTourExpenses.reduce((sum, e) => sum + e.amount, 0));
}

export function totalRoutingMiles(tour: Tour): number {
  return tour.dates.reduce((sum, d) => sum + d.routing.miles, 0);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function formatCurrency(n: number): string {
  const abs = Math.abs(n);
  const formatted = abs >= 1000
    ? '$' + abs.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : '$' + abs.toFixed(0);
  return n < 0 ? `-${formatted}` : formatted;
}

export function formatPct(n: number): string {
  return (n * 100).toFixed(1) + '%';
}
