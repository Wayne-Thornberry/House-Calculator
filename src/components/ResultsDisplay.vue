<template>
  <div class="result-banner" :class="bannerClass">
    <span class="result-emoji" aria-hidden="true">{{ bannerEmoji }}</span>
    <h2 class="result-title">{{ bannerTitle }}</h2>
    <p class="result-text">{{ resultText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ canAfford: Boolean, totalFunds: Number, housePrice: Number })

const hasData = computed(() => props.housePrice > 0 && props.totalFunds > 0)

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
    return 'Based on the numbers you entered, it appears technically possible. This is subject to bank lending criteria and scheme eligibility. Use the savings calculator below to plan ahead.'
  }
  return 'Based on the information provided, you don\'t currently have enough even with available schemes. Try adjusting the numbers, enabling more schemes, or using the savings calculator to plan ahead.'
})
</script>
