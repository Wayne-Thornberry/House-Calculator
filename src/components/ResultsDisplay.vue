<template>
  <div class="results-display">
    <div class="card">
      <div class="card-header">
        <h2 class="text-center text-white">The Results</h2>
      </div>
      <div class="card-body">
        <p class="text-center text-uppercase font-weight-bold display-1">
          {{ resultEmoji }}
        </p>

        <p class="text-center lead">
          {{ resultText }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  canAfford: Boolean,
  totalFunds: Number,
  housePrice: Number
})

const resultEmoji = computed(() => {
  return props.canAfford ? '😀' : '😔'
})

const resultText = computed(() => {
  if (props.canAfford) {
    return `Yes, it appears technically possible for you to buy a house based on the values you've entered. However, this is subject to the bank's lending criteria and whether you qualify for the schemes, grants, and loans mentioned above. Don't be discouraged if you're not quite there yet—come up with a savings plan for the coming months or years.`
  } else {
    return `Unfortunately, based on the information provided, you currently don't have enough to buy a house with a mortgage alone, even with the available schemes and your current salary. You could potentially accumulate enough through dedicated saving over several years. Alternatively, changes in the property market may improve affordability in the future.`
  }
})
</script>
