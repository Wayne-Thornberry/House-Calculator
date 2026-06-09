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
  DEPOSIT_RATE_FTB,
  DEPOSIT_RATE_NON_FTB,
  STAMP_DUTY_RATE,
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

/** Deposit rate based on FTB status (Central Bank rules). */
export function getDepositRate(isFirstTimeBuyer) {
  return isFirstTimeBuyer ? DEPOSIT_RATE_FTB : DEPOSIT_RATE_NON_FTB
}

/** Minimum deposit required in €. */
export function calculateDepositAmount(housePrice, isFirstTimeBuyer) {
  return housePrice * getDepositRate(isFirstTimeBuyer)
}

/** Loan-to-value mortgage — the amount the bank can lend based on LTV rules. */
export function calculateLTVMortgage(housePrice, isFirstTimeBuyer) {
  return housePrice * (1.0 - getDepositRate(isFirstTimeBuyer))
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
  if (cap === 0 || housePrice > cap) return 0

  const pct = usesHTB ? FHS_PERCENTAGE_WITH_HTB : FHS_PERCENTAGE_DEFAULT
  const maxFHS = housePrice * pct
  const shortfall = housePrice - (minDeposit + availableMortgage)

  return clamp(shortfall, 0, maxFHS)
}

// ---------------------------------------------------------------------------
// Help to Buy (HTB)
// ---------------------------------------------------------------------------

/** HTB refund — sum of last 4 years' income tax, capped at €30k and 10% of price. */
export function calculateHTB(y1, y2, y3, y4, housePrice) {
  const total = Number(y1) + Number(y2) + Number(y3) + Number(y4)
  const tenPct = housePrice * 0.10
  return Math.min(total, HTB_MAX_AMOUNT, tenPct)
}

// ---------------------------------------------------------------------------
// Stamp Duty
// ---------------------------------------------------------------------------

/** Stamp duty (1 % of price). No general FTB exemption in Ireland. */
export function calculateStampDuty(housePrice) {
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

/** Is the house price within HTB's €500k ceiling and eligible? */
export function isHTBEligible(housePrice, propertyCondition, isFirstTimeBuyer) {
  return areSchemesEligible(propertyCondition, isFirstTimeBuyer) && housePrice > 0 && housePrice <= HTB_HOUSE_PRICE_LIMIT
}

// ---------------------------------------------------------------------------
// Aggregate results
// ---------------------------------------------------------------------------

/** Sum all funding sources. */
export function calculateTotalFunds(availableMortgage, fhsAmount, depositAmount, htbAmount) {
  return availableMortgage + fhsAmount + depositAmount + htbAmount
}

/** Simple yes/no affordability check. Returns false when price is zero. */
export function canAffordHouse(totalFunds, housePrice) {
  if (housePrice <= 0) return false
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
