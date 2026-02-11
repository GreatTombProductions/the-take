// Tour Economics Forecast — Core Data Model

export type ScenarioName = 'conservative' | 'mid' | 'steelman';

export type BillPosition = 'headliner' | 'direct_support' | 'support' | 'opener';

export interface Tour {
  id: string;
  name: string;
  bands: Band[];
  subjectBandId: string;
  dates: TourDate[];
  offDays: OffDay[];
  preTourExpenses: Expense[];
  ongoingExpenses: OngoingExpense[];
  additionalRevenue: AdditionalRevenue[];
  scenarios: Record<ScenarioName, ScenarioParams>;
  riskProfile: RiskCategory[];
  management: ManagementTerms;
  fuelParams: FuelParams;
  metadata: {
    lastUpdated: string;
    notes: string;
    sources: Source[];
  };
}

export interface Band {
  id: string;
  name: string;
  billPosition: BillPosition;
  members: number;
  crew: number;
  spotifyMonthlyListeners: number;
  hasTouredBefore: boolean;
  merchCatalog: MerchItem[];
}

export interface TourDate {
  index: number;
  date: string;
  dayOfWeek: string;
  city: string;
  stateOrProvince: string;
  venue: Venue;
  routing: RoutingLeg;
  lodging: LodgingEstimate;
  showGuarantee: number;
}

export interface OffDay {
  date: string;
  dayOfWeek: string;
  note: string;
}

export interface Venue {
  name: string;
  capacity: number;
  capacitySourceUrl: string;
  venueUrl: string;
  estimatedAttendanceRate: number;
  merchCutPct: number;
}

export interface RoutingLeg {
  fromCity: string;
  toCity: string;
  miles: number;
}

export interface LodgingEstimate {
  type: 'hotel' | 'floor' | 'van' | 'off' | 'camper';
  estimatedCost: number;
}

export interface MerchItem {
  name: string;
  category: string;
  retailPrice: number;
  cogs: number;
  unitsOnHand: number;
}

export interface Expense {
  category: string;
  label: string;
  amount: number;
  note: string;
}

export interface OngoingExpense {
  category: string;
  label: string;
  perDay?: number;
  perShow?: number;
  headcount?: number;
}

export interface AdditionalRevenue {
  category: string;
  label: string;
  amount: number;
  frequency: 'per_show' | 'per_tour';
  note: string;
}

export interface ScenarioParams {
  label: string;
  conversionRate: number;
  avgTransactionValue: number;
  description: string;
}

export interface ManagementTerms {
  cutPct: number;
  appliedTo: 'gross' | 'net';
  bookingAgentPct: number;
}

export interface FuelParams {
  mpgLow: number;
  mpgHigh: number;
  fuelPricePerGallon: number;
}

export interface RiskCategory {
  id: string;
  name: string;
  description: string;
  probabilityPerShow: number;
  exposureRange: [number, number];
  experienceRelevance: 'none' | 'low' | 'moderate';
  withMitigationRange: [number, number];
  mitigationNote: string;
}

export interface Source {
  label: string;
  url: string;
  confidence: 'high' | 'medium' | 'low';
  section: string;
}

// Calculation results

export interface DateRevenue {
  attendance: number;
  merchGross: number;
  venueCut: number;
  cogs: number;
  mgmtCut: number;
  netMerch: number;
  showGuarantee: number;
}

export interface DateExpenses {
  fuel: number;
  lodging: number;
  perDiem: number;
  merchPerson: number;
  total: number;
}

export interface DateResult {
  date: TourDate;
  revenue: DateRevenue;
  expenses: DateExpenses;
  dateNet: number;
  cumulativeNet: number;
}

export interface TourTotals {
  grossMerch: number;
  venueCuts: number;
  cogs: number;
  mgmtCuts: number;
  netMerch: number;
  showGuarantees: number;
  additionalRevenue: number;
  totalRevenue: number;
  totalExpenses: number;
  preTourExpenses: number;
  fuelExpenses: number;
  lodgingExpenses: number;
  perDiemExpenses: number;
  crewExpenses: number;
  offDayExpenses: number;
  tourNet: number;
  perMember: number;
  riskExpected: number;
  riskRange: [number, number];
}

