<template>
  <div class="card card-accent-blue">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon blue">📅</div>
        <h3>Savings Plan</h3>
      </div>

      <div class="form-group">
        <label class="form-label" for="savingMonths">How many months can you wait?</label>
        <input id="savingMonths" type="number" min="1" max="120" :value="months" @input="$emit('update:months', Number(($event.target).value))" step="1">
      </div>

      <div class="savings-highlight">
        <span style="font-size: var(--text-sm); color: var(--text-muted);">
          To reach <strong>{{ formatCurrency(targetDeposit) }}</strong> for a
          <strong>{{ formatCurrency(housePrice) }}</strong> home
        </span>
        <span class="amount">{{ formatCurrency(monthlySavings) }}</span>
        <span style="font-size: var(--text-sm); color: var(--text-muted);">
          per month for {{ months }} month{{ months !== 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency, calculateMonthlySavings } from '../utils/calculations.js'

const props = defineProps({ months: Number, targetDeposit: Number, housePrice: Number })
defineEmits(['update:months'])

const monthlySavings = computed(() => calculateMonthlySavings(props.targetDeposit, props.months))
</script>
