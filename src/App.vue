<template>
  <div id="app" :data-theme="theme">
    <header>
      <nav class="navbar">
        <div class="container">
          <b>
            <a class="navbar-brand text-white" href=".">🏡 CanIBuyAHouse.ie</a>
          </b>
        </div>
      </nav>
    </header>

    <button class="theme-toggle" @click="toggleTheme" :title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`">
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </button>

    <main role="main">
      <div class="jumbotron">
        <div class="container">
          <h1 class="display-3">Can I buy a house?</h1>
          <p class="lead">
            A question on many people's minds right now. I won't beat around the bush—I had
            the same question and struggled to find clear answers, so I started researching. It turns out there's a lot of
            information available, but it can be overwhelming. This tool aims to help you make sense of it all.
          </p>
          <p class="lead">
            <b>All information entered below is calculated in your browser and is not stored anywhere.</b>
          </p>
          <p class="lead">
            <b>Important:</b> This calculator assumes you're purchasing a primary residence (the home you'll live in). 
            All schemes and calculations are based on this being your principal private residence, not an investment property.
          </p>
        </div>
      </div>

      <hr />

      <div class="container">
        <p class="lead">
          Before you begin, we recommend reviewing the Citizens Information guide on
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-buying-a-home/"
          >
            steps to buying a house
          </a>.
        </p>

        <div class="col mb-4">
          <div class="card">
            <div class="card-header">
              <h2 class="text-center text-white">The Inputs</h2>
            </div>

            <div class="card-body">
              <div class="row row-cols-1 row-cols-md-3">
                <div class="col mb-4">
                  <PersonInputs
                    v-model:isFirstTimeBuyer="state.isFirstTimeBuyer"
                    v-model:usesLHAL="state.usesLHAL"
                    v-model:grossSalary1="state.grossSalary1"
                    v-model:grossSalary2="state.grossSalary2"
                    v-model:customMortgage="state.customMortgage"
                    :maxMortgage="calculations.ltiMortgage"
                  />
                </div>

                <div class="col mb-4">
                  <HouseInputs
                    v-model:propertyCondition="state.propertyCondition"
                    v-model:county="state.county"
                    v-model:propertyType="state.propertyType"
                    v-model:bedrooms="state.bedrooms"
                    v-model:isDerelict="state.isDerelict"
                    v-model:housePrice="state.housePrice"
                    v-model:usesFHS="state.usesFHS"
                    v-model:useMaxAffordable="state.useMaxAffordable"
                    :canUseFHS="calculations.canUseFHS"
                    :fhsAmount="calculations.fhsAmount"
                    :fhsCap="calculations.fhsCap"
                    :totalWithFHS="calculations.totalWithFHS"
                    :ltvMortgage="calculations.ltvMortgage"
                    :depositNeeded="calculations.depositNeeded"
                    :recommendedPrice="calculations.recommendedPrice"
                  />
                </div>

                <div class="col mb-4">
                  <MoneyInputs
                    v-model:depositAmount="state.depositAmount"
                    v-model:usesHTB="state.usesHTB"
                    v-model:taxYear1="state.taxYear1"
                    v-model:taxYear2="state.taxYear2"
                    v-model:taxYear3="state.taxYear3"
                    v-model:taxYear4="state.taxYear4"
                    :canUseHTB="calculations.canUseHTB"
                    :htbAmount="calculations.htbAmount"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div class="col mb-4">
          <ResultsDisplay
            :canAfford="calculations.canAfford"
            :totalFunds="calculations.totalFunds"
            :housePrice="state.housePrice"
          />

          <div class="row row-cols-1 row-cols-md-3">
            <div class="col mb-4">
              <FeesInfo />
            </div>

            <div class="col mb-4">
              <Breakdown
                :housePrice="state.housePrice"
                :borrowedAmount="calculations.availableMortgage"
                :depositAmount="state.depositAmount"
                :fhsAmount="calculations.fhsAmount"
                :htbAmount="calculations.htbAmount"
                :stampDuty="calculations.stampDuty"
                :isDerelict="state.isDerelict"
              />
            </div>

            <div class="col mb-4">
              <SavingsCalculator
                v-model:months="state.savingMonths"
                :targetDeposit="state.depositAmount"
                :housePrice="state.housePrice"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="border-top footer text-muted">
      <div class="container">
        &copy; 2024-2025 - <a href=".">CanIBuyAHouse.ie</a>
        <p>
          <strong>Disclaimer:</strong> This calculator provides estimates based on Central Bank of Ireland rules and government scheme guidelines 
          as understood at the time of development. Results do not constitute financial advice or a guarantee of mortgage approval. 
          Actual lending decisions depend on individual circumstances, lender criteria, credit history, and affordability assessments. 
          Government schemes have specific eligibility requirements and may change. Always consult with mortgage advisors and verify 
          current rules with official sources. No data entered on this site is stored or transmitted.
        </p>
        <p>
          Found an issue? Please report it to the 
          <a target="_blank" rel="noopener noreferrer" href="https://gitlab.com/Wayno717/house-calculator">
            GitLab repository
          </a>. Contributions, forks, and suggestions are welcome!
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import PersonInputs from './components/PersonInputs.vue'
import HouseInputs from './components/HouseInputs.vue'
import MoneyInputs from './components/MoneyInputs.vue'
import ResultsDisplay from './components/ResultsDisplay.vue'
import FeesInfo from './components/FeesInfo.vue'
import Breakdown from './components/Breakdown.vue'
import SavingsCalculator from './components/SavingsCalculator.vue'
import {
  getLTIMultiplier,
  calculateMaxMortgage,
  calculateDepositAmount,
  calculateLTVMortgage,
  calculateAvailableMortgage,
  calculateFHS,
  calculateHTB,
  calculateStampDuty,
  areSchemesEligible,
  isFHSPossible,
  calculateTotalFunds,
  canAffordHouse,
  getFHSCapForCounty,
  calculateMaxAffordablePrice
} from './utils/calculations.js'
import { HTB_MAX_AMOUNT } from './utils/constants.js'

// Reactive state
const state = reactive({
  // Person
  isFirstTimeBuyer: false,
  usesLHAL: false,
  grossSalary1: 0,
  grossSalary2: 0,
  customMortgage: 0,
  
  // House
  propertyCondition: 'new',
  county: 'dublin',
  propertyType: 'house',
  bedrooms: 3,
  isDerelict: false,
  housePrice: 0,
  usesFHS: false,
  useMaxAffordable: false,
  
  // Money
  depositAmount: 0,
  usesHTB: false,
  taxYear1: 0,
  taxYear2: 0,
  taxYear3: 0,
  taxYear4: 0,
  
  // Savings
  savingMonths: 1
})

// Theme management
const theme = reactive({
  current: 'light'
})

const toggleTheme = () => {
  theme.current = theme.current === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.current)
  localStorage.setItem('theme', theme.current)
}

// Load theme from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.current = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// Computed calculations
const calculations = computed(() => {
  // Check scheme eligibility
  const schemesEligible = areSchemesEligible(state.propertyCondition, state.isFirstTimeBuyer)
  
  // Calculate LTI multiplier and max mortgage
  const ltiMultiplier = getLTIMultiplier(state.isFirstTimeBuyer, state.usesLHAL)
  const ltiMortgage = calculateMaxMortgage(state.grossSalary1, state.grossSalary2, ltiMultiplier)
  
  // Calculate deposit and LTV
  const depositNeeded = calculateDepositAmount(state.housePrice, state.bedrooms)
  const ltvMortgage = calculateLTVMortgage(state.housePrice, state.bedrooms)
  
  // Get available mortgage (use custom if provided)
  let availableMortgage
  if (state.customMortgage > 0) {
    availableMortgage = state.customMortgage
  } else {
    availableMortgage = calculateAvailableMortgage(
      ltiMortgage,
      ltvMortgage,
      state.usesLHAL,
      state.county
    )
  }
  
  // Calculate HTB
  const htbAmount = state.usesHTB 
    ? calculateHTB(state.taxYear1, state.taxYear2, state.taxYear3, state.taxYear4)
    : 0
  
  // Calculate FHS
  const fhsCap = getFHSCapForCounty(state.county)
  const fhsAmount = state.usesFHS
    ? calculateFHS(state.housePrice, availableMortgage, depositNeeded, state.county, state.usesHTB)
    : 0
  
  const totalWithFHS = depositNeeded + availableMortgage + fhsAmount
  
  // Check if schemes can be used
  const canUseFHS = schemesEligible && isFHSPossible(
    state.housePrice,
    availableMortgage,
    depositNeeded,
    state.county,
    state.usesHTB
  )
  
  const canUseHTB = schemesEligible && state.housePrice <= 500000
  
  // Calculate total funds and affordability
  const totalFunds = calculateTotalFunds(
    availableMortgage,
    fhsAmount,
    state.depositAmount,
    htbAmount
  )
  
  const canAfford = canAffordHouse(totalFunds, state.housePrice)
  
  // Calculate stamp duty
  const stampDuty = calculateStampDuty(state.housePrice)
  
  // Calculate recommended maximum affordable price
  // For max affordable, use LTI mortgage (not constrained by current house price)
  const maxAffordableAvailableMortgage = state.customMortgage > 0 
    ? state.customMortgage 
    : ltiMortgage  // Use full LTI capacity, not LTV-limited
  
  console.log('Calculating max affordable with:', {
    availableMortgage: maxAffordableAvailableMortgage,
    depositAmount: state.depositAmount,
    htbAmount,
    usesFHS: state.usesFHS,
    usesHTB: state.usesHTB,
    county: state.county,
    bedrooms: state.bedrooms
  })
  
  const recommendedPrice = calculateMaxAffordablePrice(
    maxAffordableAvailableMortgage,
    state.depositAmount,
    htbAmount,
    state.usesFHS,
    state.usesHTB,
    state.county,
    state.bedrooms
  )
  
  console.log('Calculated recommendedPrice:', recommendedPrice)
  
  return {
    ltiMortgage,
    depositNeeded,
    ltvMortgage,
    availableMortgage,
    fhsAmount,
    fhsCap,
    totalWithFHS,
    htbAmount,
    canUseFHS,
    canUseHTB,
    totalFunds,
    canAfford,
    stampDuty,
    recommendedPrice
  }
})

// Watch for eligibility changes and disable schemes if needed
watch(() => calculations.value.canUseFHS, (canUse) => {
  if (!canUse) {
    state.usesFHS = false
  }
})

watch(() => calculations.value.canUseHTB, (canUse) => {
  if (!canUse) {
    state.usesHTB = false
  }
})

// Cap FHS house price if needed
watch(() => state.housePrice, (newPrice) => {
  if (state.usesFHS) {
    const maxCap = getFHSCapForCounty(state.county)
    if (newPrice > maxCap) {
      state.housePrice = maxCap
    }
  }
})

// Watch for "use max affordable" toggle
watch(() => state.useMaxAffordable, (useMax) => {
  if (useMax) {
    // Force recalculation and update
    const recommended = calculations.value.recommendedPrice
    if (recommended > 0) {
      state.housePrice = recommended
    }
  }
})

// Update house price when recommended price changes (if using max affordable)
watch(() => calculations.value.recommendedPrice, (newRecommended) => {
  if (state.useMaxAffordable && newRecommended > 0) {
    state.housePrice = newRecommended
  }
})

// Also watch for changes in inputs that affect recommended price
watch([
  () => state.grossSalary1,
  () => state.grossSalary2,
  () => state.depositAmount,
  () => state.taxYear1,
  () => state.taxYear2,
  () => state.taxYear3,
  () => state.taxYear4,
  () => state.bedrooms,
  () => state.county,
  () => state.usesFHS,
  () => state.usesHTB,
  () => state.isFirstTimeBuyer,
  () => state.usesLHAL,
  () => state.customMortgage
], () => {
  if (state.useMaxAffordable) {
    const recommended = calculations.value.recommendedPrice
    if (recommended > 0) {
      state.housePrice = recommended
    }
  }
})
</script>

<style>
/* Component-specific styles can go here if needed */
</style>
