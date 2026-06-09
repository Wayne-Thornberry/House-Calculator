<template>
  <div class="card card-accent-green">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon green">🏠</div>
        <h3>The House</h3>
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
        <p v-if="fhsCap === 0" class="form-hint" style="color: var(--danger);">⚠ FHS and LHAL are not available in Northern Ireland.</p>
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
        </div>
      </div>

      <label class="checkbox-row">
        <input type="checkbox" :checked="isDerelict" @change="$emit('update:isDerelict', ($event.target).checked)">
        <span class="checkbox-row-text"><strong>This building is derelict</strong><span>Unlocks Vacant Property Refurbishment Grant</span></span>
      </label>

      <hr>

      <label class="checkbox-row">
        <input type="checkbox" :checked="useMaxAffordable" @change="$emit('update:useMaxAffordable', ($event.target).checked)">
        <span class="checkbox-row-text"><strong>Calculate max affordable price</strong><span>Auto-computes the theoretical ceiling</span></span>
      </label>
      <div v-if="recommendedPrice > 0" class="savings-highlight" style="margin-bottom: var(--s4);">
        <span style="font-size: var(--text-sm); color: var(--text-muted);">Maximum affordable</span>
        <span class="amount">{{ formatCurrency(recommendedPrice) }}</span>
      </div>

      <div class="stat-row">
        <span class="stat-label">House price</span>
        <span class="stat-value">{{ formatCurrency(housePrice) }}</span>
      </div>
      <p class="form-hint">Set on the previous screen. Go back to change it.</p>

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
        Central Bank rules: 10% deposit for 3+ bedrooms, 20% for 1–2 bedrooms.
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

defineEmits(['update:propertyCondition','update:county','update:propertyType','update:bedrooms','update:isDerelict','update:housePrice','update:usesFHS','update:useMaxAffordable'])

const counties = COUNTIES
const propertyConditions = PROPERTY_CONDITIONS
const propertyTypes = PROPERTY_TYPES
const bedroomOptions = BEDROOM_OPTIONS

const countyLabel = computed(() => (COUNTIES.find(c => c.value === props.county) || {}).label || props.county)
</script>
