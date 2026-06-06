// =============================================================================
// Irish House Purchase Calculator — Pure Calculation Functions
// =============================================================================
// All functions are deterministic, side-effect-free, and testable.
// =============================================================================

import {
  LTI_MULTIPLIER_FTB,
  LTI_MULTIPLIER_LHAL,
  LTI_MULTIPLIER_NON_FTB,
  FHS_PERCENTAGE_DEFAULT,
  FHS_PERCENTAGE_WITH_HTB,
  HTB_MAX_AMOUNT,
  HTB_HOUSE_PRICE_LIMIT,
  DEPOSIT_RATE_SMALL,
  DEPOSIT_RATE_LARGE,
  STAMP_DUTY_RATE,
  STAMP_DUTY_FTB_EXEMPTION_CAP,
  COUNTY_FHS_CAPS,
  LHAL_MAX_VALUES,
} from './constants.js'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Clamp a value between min and max inclusive. */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

/** Format a number as EUR currency (Irish locale). */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// ---------------------------------------------------------------------------
// Loan-to-Income (LTI)
// ---------------------------------------------------------------------------

/** Return the LTI multiplier for the given buyer profile. */
export function getLTIMultiplier(isFirstTimeBuyer, usesLHAL) {
  if (usesLHAL) return LTI_MULTIPLIER_LHAL
  return isFirstTimeBuyer ? LTI_MULTIPLIER_FTB : LTI_MULTIPLIER_NON_FTB
}

/** Maximum mortgage based purely on income × multiplier. */
export function calculateMaxMortgage(grossSalary1, grossSalary2, multiplier) {
  return (Number(grossSalary1) + Number(grossSalary2)) * multiplier
}

// ---------------------------------------------------------------------------
// Deposit & Loan-to-Value (LTV)
// ---------------------------------------------------------------------------

/** Deposit rate based on bedroom count (Central Bank rules). */
export function getDepositRate(bedrooms) {
  return bedrooms <= 2 ? DEPOSIT_RATE_SMALL : DEPOSIT_RATE_LARGE
}

/** Minimum deposit required in €. */
export function calculateDepositAmount(housePrice, bedrooms) {
  return housePrice * getDepositRate(bedrooms)
}

/** Loan-to-value mortgage — the amount the bank must lend based on LTV rules. */
export function calculateLTVMortgage(housePrice, bedrooms) {
  return housePrice * (1.0 - getDepositRate(bedrooms))
}

// ---------------------------------------------------------------------------
// Available Mortgage (constrained by LTI, LTV, and LHAL caps)
// ---------------------------------------------------------------------------

export function calculateAvailableMortgage(ltiMortgage, ltvMortgage, usesLHAL, county) {
  let available = Math.min(ltiMortgage, ltvMortgage)
  if (usesLHAL && LHAL_MAX_VALUES[county]) {
    available = Math.min(available, LHAL_MAX_VALUES[county])
  }
  return available
}

// ---------------------------------------------------------------------------
// First Home Scheme (FHS)
// ---------------------------------------------------------------------------

/** Calculate the FHS equity contribution (gap-fill between shortfall and cap). */
export function calculateFHS(housePrice, availableMortgage, minDeposit, county, usesHTB) {
  const cap = COUNTY_FHS_CAPS[county] || 0
  if (cap === 0) return 0

  const pct = usesHTB ? FHS_PERCENTAGE_WITH_HTB : FHS_PERCENTAGE_DEFAULT
  const maxFHS = cap * pct
  const shortfall = housePrice - (minDeposit + availableMortgage)

  return clamp(shortfall, 0, maxFHS)
}

// ---------------------------------------------------------------------------
// Help to Buy (HTB)
// ---------------------------------------------------------------------------

/** HTB refund — sum of last 4 years' income tax, capped at €30k. */
export function calculateHTB(y1, y2, y3, y4) {
  const total = Number(y1) + Number(y2) + Number(y3) + Number(y4)
  return Math.min(total, HTB_MAX_AMOUNT)
}

// ---------------------------------------------------------------------------
// Stamp Duty
// ---------------------------------------------------------------------------

/** Stamp duty (1 % of price), with first-time-buyer exemption ≤ €500k. */
export function calculateStampDuty(housePrice, isFirstTimeBuyer) {
  if (isFirstTimeBuyer && housePrice <= STAMP_DUTY_FTB_EXEMPTION_CAP) return 0
  return housePrice * STAMP_DUTY_RATE
}

// ---------------------------------------------------------------------------
// Eligibility checks
// ---------------------------------------------------------------------------

/** Schemes (FHS / HTB) are only available to FTBs buying new/self-build. */
export function areSchemesEligible(propertyCondition, isFirstTimeBuyer) {
  return propertyCondition !== 'secondhand' && isFirstTimeBuyer
}

/** Is FHS mathematically possible (positive contribution)? */
export function isFHSPossible(housePrice, availableMortgage, minDeposit, county, usesHTB) {
  return calculateFHS(housePrice, availableMortgage, minDeposit, county, usesHTB) > 0
}

/** Is the house price within HTB's €500k ceiling? */
export function isHTBEligible(housePrice, propertyCondition, isFirstTimeBuyer) {
  return areSchemesEligible(propertyCondition, isFirstTimeBuyer) && housePrice <= HTB_HOUSE_PRICE_LIMIT
}

// ---------------------------------------------------------------------------
// Aggregate results
// ---------------------------------------------------------------------------

/** Sum all funding sources. */
export function calculateTotalFunds(availableMortgage, fhsAmount, depositAmount, htbAmount) {
  return availableMortgage + fhsAmount + depositAmount + htbAmount
}

/** Simple yes/no affordability check. */
export function canAffordHouse(totalFunds, housePrice) {
  return totalFunds >= housePrice
}

/** Monthly savings target. */
export function calculateMonthlySavings(targetDeposit, months) {
  if (months <= 0) return 0
  return Math.round(targetDeposit / months)
}

/** Get the FHS price cap for a county. */
export function getFHSCapForCounty(county) {
  return COUNTY_FHS_CAPS[county] || 0
}

// ---------------------------------------------------------------------------
// Max Affordable Price (theoretical ceiling)
// ---------------------------------------------------------------------------

/**
 * Calculate the maximum house price someone could theoretically afford
 * given their mortgage capacity, deposit, HTB, and optionally FHS.
 */
export function calculateMaxAffordablePrice(
  availableMortgage,
  depositAmount,
  htbAmount,
  usesFHS,
  usesHTB,
  county,
) {
  const base = availableMortgage + depositAmount + htbAmount

  if (usesFHS) {
    const pct = usesHTB ? FHS_PERCENTAGE_WITH_HTB : FHS_PERCENTAGE_DEFAULT
    const cap = COUNTY_FHS_CAPS[county] || 0
    // Solving: price = base + price × pct  ⇒  price = base / (1 - pct)
    const theoretical = base / (1 - pct)
    return Math.floor(Math.min(theoretical, cap || Infinity))
  }

  return Math.floor(base)
}
