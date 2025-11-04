// County price caps for First Home Scheme
export const COUNTY_FHS_CAPS = {
  antrim: 425000,
  armagh: 425000,
  carlow: 325000,
  cavan: 325000,
  clare: 350000,
  cork: 425000,
  derry: 425000,
  donegal: 325000,
  down: 425000,
  dublin: 425000,
  fermanagh: 425000,
  galway: 450000,
  kerry: 325000,
  kildare: 425000,
  kilkenny: 375000,
  laois: 375000,
  leitrim: 325000,
  limerick: 425000,
  longford: 325000,
  louth: 375000,
  mayo: 325000,
  meath: 425000,
  monaghan: 325000,
  offaly: 325000,
  roscommon: 325000,
  sligo: 325000,
  tipperary: 325000,
  tyrone: 425000,
  waterford: 425000,
  westmeath: 375000,
  wexford: 325000,
  wicklow: 475000
}

// Local Home Authority Loan maximum values by county
export const LHAL_MAX_VALUES = {
  antrim: 425000,
  armagh: 425000,
  carlow: 275000,
  cavan: 275000,
  clare: 300000,
  cork: 330000,
  derry: 425000,
  donegal: 275000,
  down: 360000,
  dublin: 360000,
  fermanagh: 425000,
  galway: 330000,
  kerry: 275000,
  kildare: 360000,
  kilkenny: 300000,
  laois: 275000,
  leitrim: 275000,
  limerick: 300000,
  longford: 275000,
  louth: 330000,
  mayo: 275000,
  meath: 330000,
  monaghan: 275000,
  offaly: 275000,
  roscommon: 275000,
  sligo: 275000,
  tipperary: 275000,
  tyrone: 425000,
  waterford: 300000,
  westmeath: 300000,
  wexford: 300000,
  wicklow: 360000
}

export const COUNTIES = [
  { value: 'antrim', label: 'Antrim' },
  { value: 'armagh', label: 'Armagh' },
  { value: 'carlow', label: 'Carlow' },
  { value: 'cavan', label: 'Cavan' },
  { value: 'clare', label: 'Clare' },
  { value: 'cork', label: 'Cork' },
  { value: 'derry', label: 'Derry' },
  { value: 'donegal', label: 'Donegal' },
  { value: 'down', label: 'Down' },
  { value: 'dublin', label: 'Dublin' },
  { value: 'fermanagh', label: 'Fermanagh' },
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
  { value: 'tyrone', label: 'Tyrone' },
  { value: 'waterford', label: 'Waterford' },
  { value: 'westmeath', label: 'Westmeath' },
  { value: 'wexford', label: 'Wexford' },
  { value: 'wicklow', label: 'Wicklow' }
]

export const PROPERTY_CONDITIONS = [
  { value: 'new', label: 'New House' },
  { value: 'secondhand', label: 'Second Hand House' },
  { value: 'selfbuild', label: 'Self Build' }
]

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' }
]

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]

// Constants for calculations
export const LTI_MULTIPLIER_FTB = 4.0
export const LTI_MULTIPLIER_LHAL = 4.25
export const LTI_MULTIPLIER_NON_FTB = 3.5
export const FHS_PERCENTAGE_DEFAULT = 0.3
export const FHS_PERCENTAGE_WITH_HTB = 0.2
export const HTB_MAX_AMOUNT = 30000
export const HTB_HOUSE_PRICE_LIMIT = 500000
export const STAMP_DUTY_RATE = 0.01

// Deposit requirements
export const DEPOSIT_RATE_SMALL = 0.2  // For 1-2 bedroom
export const DEPOSIT_RATE_LARGE = 0.1  // For 3+ bedrooms

// Fees
export const FEES = {
  solicitor: 2000,
  snagList: 5000,
  valuation: 500,
  movers: 500,
  vacantPropertyGrant: 50000
}
