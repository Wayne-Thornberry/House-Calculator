// =============================================================================
// Irish House Purchase Calculator — Constants & Reference Data
// =============================================================================
// Last updated: 2025 — verify scheme caps against official sources before relying.
// =============================================================================

// --- First Home Scheme (FHS) price caps by county (€) -----------------------
// These are the maximum property values the FHS equity share can apply to.
// Source: https://www.firsthomescheme.ie/
// NOTE: Northern Ireland counties are listed for completeness but FHS is a
//       Republic of Ireland scheme only.
export const COUNTY_FHS_CAPS = {
  carlow: 325_000,
  cavan: 325_000,
  clare: 350_000,
  cork: 425_000,
  donegal: 325_000,
  dublin: 425_000,
  galway: 450_000,
  kerry: 325_000,
  kildare: 425_000,
  kilkenny: 375_000,
  laois: 375_000,
  leitrim: 325_000,
  limerick: 425_000,
  longford: 325_000,
  louth: 375_000,
  mayo: 325_000,
  meath: 425_000,
  monaghan: 325_000,
  offaly: 325_000,
  roscommon: 325_000,
  sligo: 325_000,
  tipperary: 325_000,
  waterford: 425_000,
  westmeath: 375_000,
  wexford: 325_000,
  wicklow: 475_000,
  // Northern Ireland — no FHS (placeholder caps of €0)
  antrim: 0,
  armagh: 0,
  derry: 0,
  down: 0,
  fermanagh: 0,
  tyrone: 0,
}

// --- Local Home Authority Loan (LHAL) maximum values by county (€) ---------
// Source: https://localauthorityhomeloan.ie/
export const LHAL_MAX_VALUES = {
  carlow: 275_000,
  cavan: 275_000,
  clare: 300_000,
  cork: 330_000,
  donegal: 275_000,
  dublin: 360_000,
  galway: 330_000,
  kerry: 275_000,
  kildare: 360_000,
  kilkenny: 300_000,
  laois: 275_000,
  leitrim: 275_000,
  limerick: 300_000,
  longford: 275_000,
  louth: 330_000,
  mayo: 275_000,
  meath: 330_000,
  monaghan: 275_000,
  offaly: 275_000,
  roscommon: 275_000,
  sligo: 275_000,
  tipperary: 275_000,
  waterford: 300_000,
  westmeath: 300_000,
  wexford: 300_000,
  wicklow: 360_000,
  // Northern Ireland — no LHAL (placeholder caps of €0)
  antrim: 0,
  armagh: 0,
  derry: 0,
  down: 0,
  fermanagh: 0,
  tyrone: 0,
}

// --- Dropdown data -----------------------------------------------------------
export const COUNTIES = [
  // Republic of Ireland
  { value: 'carlow', label: 'Carlow' },
  { value: 'cavan', label: 'Cavan' },
  { value: 'clare', label: 'Clare' },
  { value: 'cork', label: 'Cork' },
  { value: 'donegal', label: 'Donegal' },
  { value: 'dublin', label: 'Dublin' },
  { value: 'galway', label: 'Galway' },
  { value: 'kerry', label: 'Kerry' },
  { value: 'kildare', label: 'Kildare' },
  { value: 'kilkenny', label: 'Kilkenny' },
  { value: 'laois', label: 'Laois' },
  { value: 'leitrim', label: 'Leitrim' },
  { value: 'limerick', label: 'Limerick' },
  { value: 'longford', label: 'Longford' },
  { value: 'louth', label: 'Louth' },
  { value: 'mayo', label: 'Mayo' },
  { value: 'meath', label: 'Meath' },
  { value: 'monaghan', label: 'Monaghan' },
  { value: 'offaly', label: 'Offaly' },
  { value: 'roscommon', label: 'Roscommon' },
  { value: 'sligo', label: 'Sligo' },
  { value: 'tipperary', label: 'Tipperary' },
  { value: 'waterford', label: 'Waterford' },
  { value: 'westmeath', label: 'Westmeath' },
  { value: 'wexford', label: 'Wexford' },
  { value: 'wicklow', label: 'Wicklow' },
  // Northern Ireland
  { value: 'antrim', label: 'Antrim (NI)' },
  { value: 'armagh', label: 'Armagh (NI)' },
  { value: 'derry', label: 'Derry (NI)' },
  { value: 'down', label: 'Down (NI)' },
  { value: 'fermanagh', label: 'Fermanagh (NI)' },
  { value: 'tyrone', label: 'Tyrone (NI)' },
]

export const PROPERTY_CONDITIONS = [
  { value: 'new', label: 'New Build' },
  { value: 'secondhand', label: 'Second Hand' },
  { value: 'selfbuild', label: 'Self Build' },
]

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
]

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]

// --- Calculation constants ---------------------------------------------------
export const LTI_MULTIPLIER_FTB = 4.0       // First-time buyer LTI cap
export const LTI_MULTIPLIER_LHAL = 4.25     // Local Home Authority Loan LTI
export const LTI_MULTIPLIER_NON_FTB = 3.5   // Second+ buyer LTI cap

export const FHS_PERCENTAGE_DEFAULT = 0.30  // FHS equity share (no HTB)
export const FHS_PERCENTAGE_WITH_HTB = 0.20 // FHS equity share (with HTB)

export const HTB_MAX_AMOUNT = 30_000        // Help to Buy max refund (€)
export const HTB_HOUSE_PRICE_LIMIT = 500_000 // HTB eligibility price cap (€)

export const STAMP_DUTY_RATE = 0.01         // 1 % of purchase price

// Deposit rates (Central Bank macro-prudential rules)
// FTBs: 90% LTV → 10% deposit. Non-FTBs: 80% LTV → 20% deposit.
export const DEPOSIT_RATE_FTB = 0.10
export const DEPOSIT_RATE_NON_FTB = 0.20

// --- Estimated fees (€) — rough averages, update as needed -------------------
export const FEES = {
  solicitor: 2_000,
  survey: 500,
  snagList: 500,
  valuation: 185,
  movers: 500,
  vacantPropertyGrant: 50_000,
  derelictPropertyGrant: 70_000,
}

// --- Current year for dynamic footers ----------------------------------------
export const CURRENT_YEAR = new Date().getFullYear()
