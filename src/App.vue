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
      <!-- Step wizard -->
      <div class="container" style="margin-top: var(--s6);">

        <!-- Step indicator -->
        <nav class="stepper" aria-label="Progress">
          <button
            v-for="(step, i) in steps"
            :key="i"
            class="stepper-step"
            :class="{ active: currentStep === i, done: currentStep > i }"
            :disabled="currentStep < i"
            @click="currentStep = i"
            type="button"
            :aria-current="currentStep === i ? 'step' : undefined"
          >
            <span class="stepper-dot">{{ currentStep > i ? '✓' : i + 1 }}</span>
            <span class="stepper-label">{{ step }}</span>
          </button>
        </nav>

        <!-- Step 0: Welcome -->
        <div v-show="currentStep === 0">
          <div class="card card-accent-green">
            <div class="card-body welcome-card">
              <div class="hero-badge">🔒 100% Private — Computed in Your Browser</div>
              <h1 class="welcome-title">Can I buy a house?</h1>
              <p class="welcome-subtitle">
                A question on many people's minds. I had the same question and struggled
                to find clear answers, so I built this tool. It brings together mortgage
                rules, government schemes, and real costs — all in one place.
              </p>
              <p class="welcome-note">
                <strong>Important:</strong> This calculator assumes you're buying a primary
                residence. All schemes apply to principal private residences only.
              </p>
              <p style="margin-top: var(--s3);">
                <a
                  href="https://www.citizensinformation.ie/en/housing/owning-a-home/buying-a-home/steps-involved-buying-a-home/"
                  target="_blank" rel="noopener noreferrer"
                >📖 Read the Citizens Information guide →</a>
              </p>
            </div>
          </div>
          <div class="wizard-nav">
            <span></span>
            <button class="btn btn-primary btn-lg" @click="currentStep = 1" type="button">Get Started →</button>
          </div>
        </div>

        <!-- Step 1: Are you a first-time buyer? -->
        <div v-show="currentStep === 1">
          <div class="card card-accent-blue">
            <div class="card-body quick-card">
              <div class="quick-icon">🏠</div>
              <h2 class="quick-title">Are you a first-time buyer?</h2>
              <p class="quick-subtitle">
                This determines which government schemes you can use — like the
                <strong>First Home Scheme</strong> and <strong>Help to Buy</strong>.
              </p>
              <div class="quick-toggle">
                <button
                  class="quick-btn"
                  :class="{ active: ftbChosen && state.isFirstTimeBuyer === true }"
                  @click="chooseFTB(true)"
                  type="button"
                >✅ Yes, I'm a first-time buyer</button>
                <button
                  class="quick-btn"
                  :class="{ active: ftbChosen && state.isFirstTimeBuyer === false }"
                  @click="chooseFTB(false)"
                  type="button"
                >❌ No, I've owned before</button>
              </div>
            </div>
          </div>
          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 0" type="button">← Back</button>
            <button class="btn btn-primary" :disabled="!canAdvanceStep1" @click="currentStep = 2" type="button">Next → Mode</button>
          </div>
        </div>

        <!-- Step 2: How would you like to use this tool? -->
        <div v-show="currentStep === 2">
          <div class="card card-accent-green">
            <div class="card-body quick-card">
              <div class="quick-icon">🧭</div>
              <h2 class="quick-title">How would you like to use this tool?</h2>
              <p class="quick-subtitle">
                You can check if you can afford a specific house, or find out the
                maximum price you could reach with your salary and available schemes.
              </p>
              <div class="quick-toggle">
                <button
                  class="quick-btn"
                  :class="{ active: !state.useMaxAffordable }"
                  @click="chooseMode(false)"
                  type="button"
                >💰 I have a house price in mind<br><small>Check if I can afford it</small></button>
                <button
                  class="quick-btn"
                  :class="{ active: state.useMaxAffordable }"
                  @click="chooseMode(true)"
                  type="button"
                >📊 Calculate my maximum<br><small>Find the highest price I can reach</small></button>
              </div>

              <!-- Price input (only when "I have a price" is chosen) -->
              <div v-if="!state.useMaxAffordable" style="margin-top: var(--s5);">
                <div class="quick-input-wrap">
                  <span class="quick-currency">€</span>
                  <input
                    id="quickPrice"
                    type="number"
                    class="quick-price-input"
                    :value="state.housePrice || ''"
                    @input="state.housePrice = Number(($event.target).value)"
                    min="0"
                    step="5000"
                    placeholder="e.g. 350,000"
                  >
                </div>
              </div>

              <!-- Max mode summary -->
              <div v-else class="savings-highlight" style="margin-top: var(--s5);">
                <span style="font-size: var(--text-sm); color: var(--text-muted);">We'll calculate your maximum affordable price</span>
                <span class="amount" style="font-size: var(--text-base); font-weight: 600;">based on your salary, deposit &amp; schemes</span>
              </div>
            </div>
          </div>
          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 1" type="button">← Back</button>
            <button class="btn btn-primary" :disabled="!canAdvanceStep2" @click="currentStep = 3" type="button">Next → {{ state.useMaxAffordable ? 'Property Profile' : 'The House' }}</button>
          </div>
        </div>

        <!-- Step 3: The House -->
        <div v-show="currentStep === 3">
          <HouseInputs
            v-model:propertyCondition="state.propertyCondition"
            v-model:county="state.county"
            v-model:propertyType="state.propertyType"
            v-model:bedrooms="state.bedrooms"
            v-model:isDerelict="state.isDerelict"
            :housePrice="state.housePrice"
            v-model:usesFHS="state.usesFHS"
            :useMaxAffordable="state.useMaxAffordable"
            :canUseFHS="calculations.canUseFHS"
            :fhsAmount="calculations.fhsAmount"
            :fhsCap="calculations.fhsCap"
            :totalWithFHS="calculations.totalWithFHS"
            :ltvMortgage="calculations.ltvMortgage"
            :depositNeeded="calculations.depositNeeded"
            :recommendedPrice="calculations.recommendedPrice"
            :isFirstTimeBuyer="state.isFirstTimeBuyer"
            :fhsDisabledReason="calculations.fhsDisabledReason"
          />
          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 2" type="button">← Back</button>
            <button class="btn btn-primary" @click="currentStep = 4" type="button">Next → About You</button>
          </div>
        </div>

        <!-- Step 4: About You -->
        <div v-show="currentStep === 4">
          <PersonInputs
            :isFirstTimeBuyer="state.isFirstTimeBuyer"
            v-model:usesLHAL="state.usesLHAL"
            v-model:grossSalary1="state.grossSalary1"
            v-model:grossSalary2="state.grossSalary2"
            v-model:customMortgage="state.customMortgage"
            :maxMortgage="calculations.ltiMortgage"
            :usesFHS="state.usesFHS"
          />
          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 3" type="button">← The House</button>
            <button class="btn btn-primary" @click="currentStep = 5" type="button">Next → The Money</button>
          </div>
        </div>

        <!-- Step 5: The Money -->
        <div v-show="currentStep === 5">
          <MoneyInputs
            v-model:depositAmount="state.depositAmount"
            v-model:usesHTB="state.usesHTB"
            v-model:taxYear1="state.taxYear1"
            v-model:taxYear2="state.taxYear2"
            v-model:taxYear3="state.taxYear3"
            v-model:taxYear4="state.taxYear4"
            :canUseHTB="calculations.canUseHTB"
            :htbAmount="calculations.htbAmount"
            :htbDisabledReason="calculations.htbDisabledReason"
          />
          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 4" type="button">← About You</button>
            <button class="btn btn-primary" @click="currentStep = 6" type="button">See Results →</button>
          </div>
        </div>

        <!-- Step 6: Results -->
        <div v-show="currentStep === 6">
          <ResultsDisplay
            :canAfford="calculations.canAfford"
            :totalFunds="calculations.totalFunds"
            :housePrice="state.housePrice"
            :recommendedPrice="calculations.recommendedPrice"
          />

          <div v-if="state.housePrice > 0" class="grid-2" style="margin-top: var(--s5);">
            <FeesInfo />
            <Breakdown
              :housePrice="state.housePrice"
              :borrowedAmount="calculations.availableMortgage"
              :depositAmount="state.depositAmount"
              :fhsAmount="calculations.fhsAmount"
              :htbAmount="calculations.htbAmount"
              :stampDuty="calculations.stampDuty"
              :isDerelict="state.isDerelict"
            />
            <SavingsCalculator
              v-model:months="state.savingMonths"
              :targetDeposit="state.depositAmount || calculations.depositNeeded"
              :housePrice="state.housePrice"
            />
          </div>

          <div class="wizard-nav">
            <button class="btn btn-ghost" @click="currentStep = 5" type="button">← The Money</button>
            <span></span>
          </div>
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

// Step wizard
const steps = ['Welcome', 'FTB?', 'Mode', 'House', 'About You', 'Money', 'Results']
const currentStep = ref(0)
const ftbChosen = ref(false)
const modeChosen = ref(false)

function chooseFTB(val) {
  state.isFirstTimeBuyer = val
  ftbChosen.value = true
}

function chooseMode(max) {
  state.useMaxAffordable = max
  modeChosen.value = true
  if (max) {
    state.housePrice = 0
    state.usesFHS = true
  }
}

const canAdvanceStep1 = computed(() => ftbChosen.value)
const canAdvanceStep2 = computed(() => {
  if (!modeChosen.value) return false
  if (!state.useMaxAffordable && (!state.housePrice || state.housePrice <= 0)) return false
  return true
})

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
  const depositNeeded = calculateDepositAmount(state.housePrice, state.isFirstTimeBuyer)
  const ltvMortgage = calculateLTVMortgage(state.housePrice, state.isFirstTimeBuyer)

  const availableMortgage = state.customMortgage > 0
    ? state.customMortgage
    : calculateAvailableMortgage(ltiMortgage, ltvMortgage, state.usesLHAL, state.county)

  const htbAmount = state.usesHTB
    ? calculateHTB(state.taxYear1, state.taxYear2, state.taxYear3, state.taxYear4, state.housePrice)
    : 0

  const fhsCap = getFHSCapForCounty(state.county)
  const fhsAmount = state.usesFHS
    ? calculateFHS(state.housePrice, availableMortgage, depositNeeded, state.county, state.usesHTB)
    : 0

  const totalWithFHS = depositNeeded + availableMortgage + fhsAmount

  const canUseFHS = eligible && isFHSPossible(state.housePrice, availableMortgage, depositNeeded, state.county, state.usesHTB)
  const canUseHTB = eligible && state.housePrice <= 500_000 && state.housePrice > 0

  // Build human-readable reasons when schemes are disabled
  const fhsDisabledReason = (() => {
    if (canUseFHS) return ''
    if (!state.isFirstTimeBuyer) return 'Set your status in the FTB? step first'
    if (state.propertyCondition === 'secondhand') return 'Only available for new builds and self-builds'
    const fhsCapLocal = getFHSCapForCounty(state.county)
    if (fhsCapLocal === 0) return 'Not available in Northern Ireland'
    if (!state.housePrice || state.housePrice <= 0) return 'Enter a house price in the Mode step'
    // Eligible but no shortfall — mortgage + deposit already cover the price
    return 'Your mortgage and deposit already cover this price — FHS not needed'
  })()

  const htbDisabledReason = (() => {
    if (canUseHTB) return ''
    if (!state.isFirstTimeBuyer) return 'Set your status in the FTB? step first'
    if (state.propertyCondition === 'secondhand') return 'Only available for new builds and self-builds'
    if (!state.housePrice || state.housePrice <= 0) return 'Enter a house price in the Mode step'
    if (state.housePrice > 500_000) return 'House price exceeds the €500,000 HTB limit'
    return ''
  })()

  const totalFunds = calculateTotalFunds(availableMortgage, fhsAmount, state.depositAmount, htbAmount)
  const canAfford = canAffordHouse(totalFunds, state.housePrice)
  const stampDuty = calculateStampDuty(state.housePrice)

  const maxAffMortgage = state.customMortgage > 0 ? state.customMortgage : ltiMortgage
  const recommendedPrice = calculateMaxAffordablePrice(maxAffMortgage, state.depositAmount, htbAmount, state.usesFHS, state.usesHTB, state.county)

  return { ltiMortgage, depositNeeded, ltvMortgage, availableMortgage, fhsAmount, fhsCap, totalWithFHS, htbAmount, canUseFHS, canUseHTB, totalFunds, canAfford, stampDuty, recommendedPrice, fhsDisabledReason, htbDisabledReason }
})

// Watchers
watch(() => calculations.value.canUseFHS, ok => {
  if (!ok) { state.usesFHS = false }
  else if (state.useMaxAffordable) { state.usesFHS = true }
})
watch(() => calculations.value.canUseHTB, ok => { if (!ok) state.usesHTB = false })
watch(() => state.usesFHS, on => { if (on) state.usesLHAL = false })

watch(() => state.housePrice, price => {
  if (state.usesFHS) {
    const cap = getFHSCapForCounty(state.county)
    if (cap > 0 && price > cap) state.housePrice = cap
  }
})

// Re-clamp house price when county changes while FHS is active
watch(() => state.county, () => {
  if (state.usesFHS && state.housePrice > 0) {
    const cap = getFHSCapForCounty(state.county)
    if (cap > 0 && state.housePrice > cap) state.housePrice = cap
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
  () => state.county, () => state.usesFHS, () => state.usesHTB,
  () => state.isFirstTimeBuyer, () => state.usesLHAL, () => state.customMortgage,
  () => state.propertyCondition,
], () => {
  if (state.useMaxAffordable && calculations.value.recommendedPrice > 0) state.housePrice = calculations.value.recommendedPrice
})
</script>

<style>
/* Component-specific styles can go here if needed */
</style>
