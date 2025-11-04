<template>
  <div class="savings-calculator">
    <div class="card">
      <div class="card-header">
        <h3 class="text-center text-white">The Numbers</h3>
      </div>
      <div class="card-body">
        <div>
          <label class="form-check-label">How many months can you wait?</label>
          <input
            class="form-control"
            type="number"
            min="1"
            max="120"
            :value="months"
            @input="$emit('update:months', Number($event.target.value))"
            step="1"
          />
        </div>

        <p>
          To reach your target deposit of <strong>{{ formatCurrency(targetDeposit) }}</strong>
          for a house costing <strong>{{ formatCurrency(housePrice) }}</strong>, you
          would need to save <strong>{{ formatCurrency(monthlySavings) }}</strong> per month
          over <strong>{{ months }}</strong> month{{ months !== 1 ? 's' : '' }}.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, calculateMonthlySavings } from '../utils/calculations.js'

const props = defineProps({
  months: Number,
  targetDeposit: Number,
  housePrice: Number
})

defineEmits(['update:months'])

const monthlySavings = computed(() => {
  return calculateMonthlySavings(props.targetDeposit, props.months)
})
</script>
