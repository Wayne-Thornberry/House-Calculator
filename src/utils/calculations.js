import {
  LTI_MULTIPLIER_FTB,
  LTI_MULTIPLIER_LHAL,
  LTI_MULTIPLIER_NON_FTB,
  FHS_PERCENTAGE_DEFAULT,
  FHS_PERCENTAGE_WITH_HTB,
  HTB_MAX_AMOUNT,
  DEPOSIT_RATE_SMALL,
  DEPOSIT_RATE_LARGE,
  STAMP_DUTY_RATE,
  COUNTY_FHS_CAPS,
  LHAL_MAX_VALUES
} from './constants.js'

/**
 * Calculate the loan-to-income multiplier based on buyer type
 */
export function getLTIMultiplier(isFirstTimeBuyer, usesLHAL) {
  if (usesLHAL) return LTI_MULTIPLIER_LHAL
  if (isFirstTimeBuyer) return LTI_MULTIPLIER_FTB
  return LTI_MULTIPLIER_NON_FTB
}

/**
 * Calculate maximum mortgage based on gross salary and multiplier
 */
export function calculateMaxMortgage(grossSalary1, grossSalary2, multiplier) {
  const combinedSalary = Number(grossSalary1) + Number(grossSalary2)
  return combinedSalary * multiplier
}

/**
 * Calculate deposit percentage required based on number of bedrooms
 */
export function getDepositRate(bedrooms) {
  return bedrooms <= 2 ? DEPOSIT_RATE_SMALL : DEPOSIT_RATE_LARGE
}

/**
 * Calculate required deposit amount
 */
export function calculateDepositAmount(housePrice, bedrooms) {
  const depositRate = getDepositRate(bedrooms)
  return housePrice * depositRate
}

/**
 * Calculate loan-to-value mortgage (mortgage needed)
 */
export function calculateLTVMortgage(housePrice, bedrooms) {
  const depositRate = getDepositRate(bedrooms)
  return housePrice * (1.0 - depositRate)
}

/**
 * Get the smaller of two values (for capping mortgages)
 */
export function getMinValue(...values) {
  return Math.min(...values)
}

/**
 * Calculate available mortgage considering all constraints
 */
export function calculateAvailableMortgage(
  ltiMortgage,
  ltvMortgage,
  usesLHAL,
  county
) {
  let availableMortgage = getMinValue(ltiMortgage, ltvMortgage)
  
  if (usesLHAL) {
    const lhalMax = LHAL_MAX_VALUES[county] || 0
    availableMortgage = getMinValue(availableMortgage, lhalMax)
  }
  
  return availableMortgage
}

/**
 * Calculate First Home Scheme contribution
 */
export function calculateFHS(
  housePrice,
  availableMortgage,
  minDeposit,
  county,
  usesHTB
) {
  const maxFHSAllowance = COUNTY_FHS_CAPS[county] || 0
  const fhsPercentage = usesHTB ? FHS_PERCENTAGE_WITH_HTB : FHS_PERCENTAGE_DEFAULT
  
  const maxFHS = maxFHSAllowance * fhsPercentage
  const outputValue = minDeposit + availableMortgage
  const minFHS = housePrice - outputValue
  
  const fhs = getMinValue(maxFHS, minFHS)
  return Math.max(0, fhs)
}

/**
 * Calculate Help to Buy value from income tax paid over 4 years
 */
export function calculateHTB(year1, year2, year3, year4) {
  const total = Number(year1) + Number(year2) + Number(year3) + Number(year4)
  return getMinValue(total, HTB_MAX_AMOUNT)
}

/**
 * Calculate stamp duty (1% of house price)
 */
export function calculateStampDuty(housePrice) {
  return housePrice * STAMP_DUTY_RATE
}

/**
 * Check if schemes are eligible based on property condition and buyer type
 */
export function areSchemesEligible(propertyCondition, isFirstTimeBuyer) {
  // Second-hand houses or non-first-time buyers cannot use schemes
  return propertyCondition !== 'secondhand' && isFirstTimeBuyer
}

/**
 * Check if FHS is possible given current inputs
 */
export function isFHSPossible(
  housePrice,
  availableMortgage,
  minDeposit,
  county,
  usesHTB
) {
  const fhs = calculateFHS(housePrice, availableMortgage, minDeposit, county, usesHTB)
  return fhs > 0
}

/**
 * Check if house price is within HTB limits
 */
export function isHTBEligible(housePrice, propertyCondition, isFirstTimeBuyer) {
  return (
    areSchemesEligible(propertyCondition, isFirstTimeBuyer) &&
    housePrice <= HTB_MAX_AMOUNT * 16.67 // Roughly 500k limit
  )
}

/**
 * Calculate total funds available for purchase
 */
export function calculateTotalFunds(
  availableMortgage,
  fhsAmount,
  depositAmount,
  htbAmount
) {
  return availableMortgage + fhsAmount + depositAmount + htbAmount
}

/**
 * Determine if house can be afforded
 */
export function canAffordHouse(totalFunds, housePrice) {
  return totalFunds >= housePrice
}

/**
 * Calculate monthly savings needed
 */
export function calculateMonthlySavings(targetDeposit, months) {
  if (months <= 0) return 0
  return Math.round(targetDeposit / months)
}

/**
 * Format currency value
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Get FHS cap for county
 */
export function getFHSCapForCounty(county) {
  return COUNTY_FHS_CAPS[county] || 0
}

/**
 * Calculate maximum affordable house price based on all available resources
 * This represents the theoretical maximum you could afford with:
 * - Your available mortgage (LTI)
 * - Your deposit
 * - Help to Buy (if enabled)
 * - First Home Scheme (if enabled)
 */
export function calculateMaxAffordablePrice(
  availableMortgage,
  depositAmount,
  htbAmount,
  usesFHS,
  usesHTB,
  county,
  bedrooms
) {
  // Start with what you can definitely pay: mortgage + deposit + HTB
  let totalFunds = availableMortgage + depositAmount + htbAmount
  
  // If using FHS, we need to work backwards
  // FHS contributes a percentage of the house price
  // So if FHS is 30% (or 20% with HTB), then:
  // housePrice = mortgage + deposit + HTB + (housePrice × FHS%)
  // Solving for housePrice:
  // housePrice × (1 - FHS%) = mortgage + deposit + HTB
  // housePrice = (mortgage + deposit + HTB) / (1 - FHS%)
  
  if (usesFHS) {
    const fhsPercentage = usesHTB ? FHS_PERCENTAGE_WITH_HTB : FHS_PERCENTAGE_DEFAULT
    const maxFHSCap = COUNTY_FHS_CAPS[county] || 0
    
    // Calculate theoretical max with FHS
    const theoreticalMax = totalFunds / (1 - fhsPercentage)
    
    // But it's capped by county limits
    const maxPrice = Math.min(theoreticalMax, maxFHSCap)
    
    return Math.floor(maxPrice)
  }
  
  // Without FHS, maximum affordable is simply: mortgage + deposit + HTB
  // The mortgage amount is already the approved/available mortgage from the bank
  const maxPrice = totalFunds
  
  return Math.floor(maxPrice)
}
