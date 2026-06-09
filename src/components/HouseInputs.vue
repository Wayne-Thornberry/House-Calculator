<template>
  <div class="card card-accent-green">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon green">{{ useMaxAffordable ? '🎯' : '🏠' }}</div>
        <h3>{{ useMaxAffordable ? 'Property Profile' : 'The House' }}</h3>
      </div>

      <div v-if="useMaxAffordable && isFirstTimeBuyer" class="callout info">
        These settings determine what you can afford. We'll include the <strong>First Home Scheme at its maximum rate</strong> in your calculation.
      </div>
      <div v-if="useMaxAffordable && !isFirstTimeBuyer" class="callout warn">
        As a non-first-time buyer, the <strong>First Home Scheme</strong> and <strong>Help to Buy</strong> are not available to you.
      </div>

      <div v-if="propertyCondition === 'secondhand'" class="callout warn">
        <strong>FHS &amp; HTB</strong> are only available for <strong>new builds or self-builds</strong>.
        Second-hand properties don't qualify.
      </div>

      <div class="form-group">
        <label class="form-label" for="pcSelect">I want to buy a…</label>
        <select id="pcSelect" :value="propertyCondition" @change="$emit('update:propertyCondition', ($event.target).value)">
          <option v-for="o in propertyConditions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
        <p v-if="propertyCondition === 'secondhand' && isFirstTimeBuyer" class="form-hint" style="color: var(--danger);">⚠ As a first-time buyer, choosing Second Hand means you lose access to FHS and HTB.</p>
      </div>

      <div class="form-group">
        <label class="form-label" for="cSelect">County</label>
        <select id="cSelect" :value="county" @change="$emit('update:county', ($event.target).value)">
          <option v-for="c in counties" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <p v-if="fhsCap === 0" class="form-hint" style="color: var(--danger);">⚠ FHS and the Local Authority Home Loan are not available in Northern Ireland.</p>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label" for="ptSelect">Property type</label>
          <select id="ptSelect" :value="propertyType" @change="$emit('update:propertyType', ($event.target).value)">
            <option v-for="t in propertyTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="bedsOption">Bedrooms</label>
          <select id="bedsOption" :value="bedrooms" @change="$emit('update:bedrooms', Number(($event.target).value))">
            <option v-for="n in bedroomOptions" :key="n" :value="n">{{ n }}</option>
          </select>
          <p class="form-hint">For informational use — does not affect mortgage calculations.</p>
        </div>
      </div>

      <label class="checkbox-row">
        <input type="checkbox" :checked="isDerelict" @change="$emit('update:isDerelict', ($event.target).checked)">
        <span class="checkbox-row-text"><strong>This building is derelict</strong><span>Unlocks Vacant Property Refurbishment Grant</span></span>
      </label>

      <hr>

      <!-- Max affordable mode: hide the toggle, show computed ceiling -->
      <div v-if="useMaxAffordable">
        <div v-if="recommendedPrice > 0" class="savings-highlight" style="margin-bottom: var(--s4);">
          <span style="font-size: var(--text-sm); color: var(--text-muted);">🏆 Maximum affordable price</span>
          <span class="amount">{{ formatCurrency(recommendedPrice) }}</span>
          <p class="form-hint" style="margin-top: var(--s2);">Based on your salary, deposit, and eligible schemes. Fill in About You &amp; Money to see it update.</p>
        </div>
        <div v-else class="callout info">
          📋 Enter your salary and deposit in the next steps to calculate your maximum affordable price.
        </div>
        <div v-if="housePrice > 0" class="stat-row">
          <span class="stat-label">Current calculated price</span>
          <span class="stat-value">{{ formatCurrency(housePrice) }}</span>
        </div>
      </div>

      <!-- Price mode: show the manual price -->
      <template v-else>
        <div class="stat-row">
          <span class="stat-label">House price</span>
          <span class="stat-value">{{ formatCurrency(housePrice) }}</span>
        </div>
        <p class="form-hint">Set on the previous screen. Go back to change it.</p>
      </template>

      <hr>

      <label class="checkbox-row">
        <input type="checkbox" :checked="usesFHS" @change="$emit('update:usesFHS', ($event.target).checked)" :disabled="!canUseFHS">
        <span class="checkbox-row-text"><strong>Use the First Home Scheme</strong><span>Government equity share up to 30%</span></span>
      </label>
      <p v-if="!canUseFHS && fhsDisabledReason" class="disabled-hint">🔒 {{ fhsDisabledReason }}</p>
      <a href="https://www.firsthomescheme.ie/" target="_blank" rel="noopener noreferrer" class="inline-link">Learn about FHS</a>

      <div v-if="usesFHS && fhsAmount > 0" class="fhs-box">
        <div class="stat-row"><span class="stat-label">{{ countyLabel }} area cap</span><span class="stat-value">{{ formatCurrency(fhsCap) }}</span></div>
        <div class="stat-row"><span class="stat-label">FHS contribution</span><span class="stat-value accent">+{{ formatCurrency(fhsAmount) }}</span></div>
        <div class="stat-row"><span class="stat-label">Total with FHS</span><span class="stat-value accent">{{ formatCurrency(totalWithFHS) }}</span></div>
      </div>

      <hr>

      <div class="stat-row"><span class="stat-label">Loan-to-Value (LTV)</span><span class="stat-value">{{ formatCurrency(ltvMortgage) }}</span></div>
      <div class="stat-row"><span class="stat-label">Min deposit required</span><span class="stat-value accent">{{ formatCurrency(depositNeeded) }}</span></div>
      <p class="form-hint" style="margin-top: var(--s3);">
        Central Bank rules: 10% deposit for first-time buyers, 20% for second-time+ buyers.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'
import { COUNTIES, PROPERTY_CONDITIONS, PROPERTY_TYPES, BEDROOM_OPTIONS } from '../utils/constants.js'

const props = defineProps({
  propertyCondition: String, county: String, propertyType: String, bedrooms: Number,
  isDerelict: Boolean, housePrice: Number, usesFHS: Boolean, canUseFHS: Boolean,
  fhsAmount: Number, fhsCap: Number, totalWithFHS: Number, ltvMortgage: Number,
  depositNeeded: Number, useMaxAffordable: Boolean, recommendedPrice: Number,
  isFirstTimeBuyer: Boolean, fhsDisabledReason: String,
})

defineEmits(['update:propertyCondition','update:county','update:propertyType','update:bedrooms','update:isDerelict','update:usesFHS'])

const counties = COUNTIES
const propertyConditions = PROPERTY_CONDITIONS
const propertyTypes = PROPERTY_TYPES
const bedroomOptions = BEDROOM_OPTIONS

const countyLabel = computed(() => (COUNTIES.find(c => c.value === props.county) || {}).label || props.county)
</script>
