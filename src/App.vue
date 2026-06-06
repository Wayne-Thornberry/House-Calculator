<template>
  <div id="app" :data-theme="theme">
    <!-- Header -->
    <header class="site-header">
      <div class="header-inner">
        <a class="logo" href="." aria-label="Can I Buy A House — Home">
          <span class="logo-icon">🏡</span> CanIBuyAHouse.ie
        </a>
        <button class="theme-btn" @click="toggleTheme" :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`">
          {{ theme === 'light' ? '🌙' : '☀️' }} {{ theme === 'light' ? 'Dark' : 'Light' }}
        </button>
      </div>
    </header>

    <main>
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-badge">🔒 100% Private — Computed in Your Browser</div>
          <h1>Can I buy a house?</h1>
          <p class="hero-subtitle">
            A question on many people's minds. I had the same question and struggled
            to find clear answers, so I built this tool. It brings together mortgage
            rules, government schemes, and real costs — all in one place.
          </p>
          <p class="hero-note">
            <strong>Important:</strong> This calculator assumes you're buying a primary
            residence. All schemes apply to principal private residences only.
          </p>
          <p style="margin-top: 12px;">
            <a
              href="https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-buying-a-home/"
              target="_blank" rel="noopener noreferrer"
            >📖 Read the Citizens Information guide →</a>
          </p>
        </div>
      </section>

      <!-- Inputs section -->
      <div class="container" style="margin-top: var(--s6);">
        <div class="section-label"><span>Your Information</span></div>
        <div class="grid-3">
          <PersonInputs
            v-model:isFirstTimeBuyer="state.isFirstTimeBuyer"
            v-model:usesLHAL="state.usesLHAL"
            v-model:grossSalary1="state.grossSalary1"
            v-model:grossSalary2="state.grossSalary2"
            v-model:customMortgage="state.customMortgage"
            :maxMortgage="calculations.ltiMortgage"
          />
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

      <!-- Results -->
      <div class="container" style="margin-top: var(--s6);">
        <div class="section-label"><span>Results &amp; Breakdown</span></div>

        <ResultsDisplay
          :canAfford="calculations.canAfford"
          :totalFunds="calculations.totalFunds"
          :housePrice="state.housePrice"
        />

        <div class="grid-3" style="margin-top: var(--s5);">
          <FeesInfo :isFirstTimeBuyer="state.isFirstTimeBuyer" />
          <Breakdown
            :housePrice="state.housePrice"
            :borrowedAmount="calculations.availableMortgage"
            :depositAmount="state.depositAmount"
            :fhsAmount="calculations.fhsAmount"
            :htbAmount="calculations.htbAmount"
            :stampDuty="calculations.stampDuty"
            :isDerelict="state.isDerelict"
            :isFirstTimeBuyer="state.isFirstTimeBuyer"
          />
          <SavingsCalculator
            v-model:months="state.savingMonths"
            :targetDeposit="state.depositAmount"
            :housePrice="state.housePrice"
          />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2024&ndash;{{ currentYear }} &mdash; <a href=".">CanIBuyAHouse.ie</a></p>
        <p>
          <strong>Disclaimer:</strong> This calculator provides estimates based on Central
          Bank of Ireland rules and government scheme guidelines. Results do not constitute
          financial advice or a guarantee of mortgage approval. Actual lending decisions
          depend on individual circumstances, lender criteria, credit history, and
          affordability assessments. Always consult with mortgage advisors and verify
          current rules with official sources. No data entered on this site is stored or transmitted.
        </p>
        <p>
          Found an issue?
          <a target="_blank" rel="noopener noreferrer" href="https://gitlab.com/Wayno717/house-calculator">Report it on GitLab</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import PersonInputs from './components/PersonInputs.vue'
import HouseInputs from './components/HouseInputs.vue'
import MoneyInputs from './components/MoneyInputs.vue'
import ResultsDisplay from './components/ResultsDisplay.vue'
import FeesInfo from './components/FeesInfo.vue'
import Breakdown from './components/Breakdown.vue'
import SavingsCalculator from './components/SavingsCalculator.vue'
import { CURRENT_YEAR } from './utils/constants.js'
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
  calculateMaxAffordablePrice,
} from './utils/calculations.js'

const currentYear = CURRENT_YEAR

const state = reactive({
  isFirstTimeBuyer: false,
  usesLHAL: false,
  grossSalary1: 0,
  grossSalary2: 0,
  customMortgage: 0,
  propertyCondition: 'new',
  county: 'dublin',
  propertyType: 'house',
  bedrooms: 3,
  isDerelict: false,
  housePrice: 0,
  usesFHS: false,
  useMaxAffordable: false,
  depositAmount: 0,
  usesHTB: false,
  taxYear1: 0,
  taxYear2: 0,
  taxYear3: 0,
  taxYear4: 0,
  savingMonths: 1,
})

// Theme
const KEY = 'house-calc-theme'

function getTheme() {
  const s = localStorage.getItem(KEY)
  if (s === 'dark' || s === 'light') return s
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref(getTheme())

function apply(t) {
  theme.value = t
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem(KEY, t)
}

function toggleTheme() { apply(theme.value === 'light' ? 'dark' : 'light') }
onMounted(() => apply(theme.value))

// Computed
const calculations = computed(() => {
  const eligible = areSchemesEligible(state.propertyCondition, state.isFirstTimeBuyer)
  const ltiM = getLTIMultiplier(state.isFirstTimeBuyer, state.usesLHAL)
  const ltiMortgage = calculateMaxMortgage(state.grossSalary1, state.grossSalary2, ltiM)
  const depositNeeded = calculateDepositAmount(state.housePrice, state.bedrooms)
  const ltvMortgage = calculateLTVMortgage(state.housePrice, state.bedrooms)

  const availableMortgage = state.customMortgage > 0
    ? state.customMortgage
    : calculateAvailableMortgage(ltiMortgage, ltvMortgage, state.usesLHAL, state.county)

  const htbAmount = state.usesHTB
    ? calculateHTB(state.taxYear1, state.taxYear2, state.taxYear3, state.taxYear4)
    : 0

  const fhsCap = getFHSCapForCounty(state.county)
  const fhsAmount = state.usesFHS
    ? calculateFHS(state.housePrice, availableMortgage, depositNeeded, state.county, state.usesHTB)
    : 0

  const totalWithFHS = depositNeeded + availableMortgage + fhsAmount

  const canUseFHS = eligible && isFHSPossible(state.housePrice, availableMortgage, depositNeeded, state.county, state.usesHTB)
  const canUseHTB = eligible && state.housePrice <= 500_000

  const totalFunds = calculateTotalFunds(availableMortgage, fhsAmount, state.depositAmount, htbAmount)
  const canAfford = canAffordHouse(totalFunds, state.housePrice)
  const stampDuty = calculateStampDuty(state.housePrice, state.isFirstTimeBuyer)

  const maxAffMortgage = state.customMortgage > 0 ? state.customMortgage : ltiMortgage
  const recommendedPrice = calculateMaxAffordablePrice(maxAffMortgage, state.depositAmount, htbAmount, state.usesFHS, state.usesHTB, state.county)

  return { ltiMortgage, depositNeeded, ltvMortgage, availableMortgage, fhsAmount, fhsCap, totalWithFHS, htbAmount, canUseFHS, canUseHTB, totalFunds, canAfford, stampDuty, recommendedPrice }
})

// Watchers
watch(() => calculations.value.canUseFHS, ok => { if (!ok) state.usesFHS = false })
watch(() => calculations.value.canUseHTB, ok => { if (!ok) state.usesHTB = false })

watch(() => state.housePrice, price => {
  if (state.usesFHS) {
    const cap = getFHSCapForCounty(state.county)
    if (cap > 0 && price > cap) state.housePrice = cap
  }
})

watch(() => state.useMaxAffordable, on => {
  if (on && calculations.value.recommendedPrice > 0) state.housePrice = calculations.value.recommendedPrice
})

watch(() => calculations.value.recommendedPrice, rp => {
  if (state.useMaxAffordable && rp > 0) state.housePrice = rp
})

watch([
  () => state.grossSalary1, () => state.grossSalary2, () => state.depositAmount,
  () => state.taxYear1, () => state.taxYear2, () => state.taxYear3, () => state.taxYear4,
  () => state.bedrooms, () => state.county, () => state.usesFHS, () => state.usesHTB,
  () => state.isFirstTimeBuyer, () => state.usesLHAL, () => state.customMortgage,
], () => {
  if (state.useMaxAffordable && calculations.value.recommendedPrice > 0) state.housePrice = calculations.value.recommendedPrice
})
</script>

<style>
/* Component-specific styles can go here if needed */
</style>
