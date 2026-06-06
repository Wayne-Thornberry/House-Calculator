<template>
  <div class="result-banner" :class="canAfford ? 'yes' : 'no'">
    <span class="result-emoji" aria-hidden="true">{{ canAfford ? '😀' : '😔' }}</span>
    <h2 class="result-title">{{ canAfford ? 'Yes, it looks possible!' : 'Not quite there yet' }}</h2>
    <p class="result-text">{{ resultText }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ canAfford: Boolean, totalFunds: Number, housePrice: Number })

const resultText = computed(() => {
  if (props.canAfford) {
    return 'Based on the numbers you entered, it appears technically possible. This is subject to bank lending criteria and scheme eligibility. Use the savings calculator below to plan ahead.'
  }
  return 'Based on the information provided, you don\'t currently have enough even with available schemes. Try adjusting the numbers, enabling more schemes, or using the savings calculator to plan ahead.'
})
</script>
