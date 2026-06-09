<template>
  <div class="result-banner" :class="bannerClass">
    <span class="result-emoji" aria-hidden="true">{{ bannerEmoji }}</span>
    <h2 class="result-title">{{ bannerTitle }}</h2>

    <div v-if="hasData" class="result-numbers">
      <div class="result-number-row">
        <span>Your total funds</span>
        <strong>{{ formatCurrency(totalFunds) }}</strong>
      </div>
      <div class="result-number-row">
        <span>House price</span>
        <strong>{{ formatCurrency(housePrice) }}</strong>
      </div>
      <div class="result-number-row" :class="canAfford ? 'surplus' : 'shortfall'">
        <span>{{ canAfford ? 'Surplus' : 'Shortfall' }}</span>
        <strong>{{ canAfford ? '+' : '−' }}{{ formatCurrency(gap) }}</strong>
      </div>
    </div>

    <p class="result-text">{{ resultText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'

const props = defineProps({ canAfford: Boolean, totalFunds: Number, housePrice: Number, recommendedPrice: Number })

const hasData = computed(() => props.housePrice > 0 && props.totalFunds > 0)

const gap = computed(() => Math.abs(props.totalFunds - props.housePrice))

const bannerClass = computed(() => {
  if (!hasData.value) return 'no'
  return props.canAfford ? 'yes' : 'no'
})

const bannerEmoji = computed(() => {
  if (!hasData.value) return '📋'
  return props.canAfford ? '😀' : '😔'
})

const bannerTitle = computed(() => {
  if (!hasData.value) return 'Fill in your details above'
  return props.canAfford ? 'Yes, it looks possible!' : 'Not quite there yet'
})

const resultText = computed(() => {
  if (!hasData.value) {
    return 'Enter your salary, deposit, and house details in the steps above to see if you can afford a home.'
  }
  if (props.canAfford) {
    if (props.recommendedPrice > 0) {
      return `Your maximum affordable price is ${formatCurrency(props.recommendedPrice)}. This is subject to bank lending criteria and scheme eligibility. Use the savings calculator below to plan ahead.`
    }
    return `You have ${formatCurrency(gap.value)} more than needed. This is subject to bank lending criteria and scheme eligibility. Remember to budget for fees and extras below.`
  }
  return `You're ${formatCurrency(gap.value)} short. Try enabling more schemes, increasing your deposit, or use the savings calculator below to plan how long it would take to close the gap.`
})
</script>
