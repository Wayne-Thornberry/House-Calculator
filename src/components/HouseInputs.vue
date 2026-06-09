<template>
  <div class="card card-accent-green">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon green">🏠</div>
        <h3>The House</h3>
      </div>

      <div v-if="propertyCondition === 'secondhand'" class="callout warn">
        FHS &amp; HTB are for <strong>new builds &amp; self-builds only</strong>.
      </div>

      <div class="form-group">
        <label class="form-label" for="pcSelect">Property</label>
        <select id="pcSelect" :value="propertyCondition" @change="$emit('update:propertyCondition', ($event.target).value)">
          <option v-for="o in propertyConditions" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="cSelect">County</label>
        <select id="cSelect" :value="county" @change="$emit('update:county', ($event.target).value)">
          <option v-for="c in counties" :key="c.value" :value="c.value">{{ c.label }}</option>
        </select>
        <p v-if="fhsCap === 0" class="form-hint" style="color: var(--danger);">⚠ Schemes not available in NI.</p>
      </div>

      <div v-if="useMaxAffordable">
        <div v-if="recommendedPrice > 0" class="savings-highlight">
          <span style="font-size:var(--text-sm);color:var(--text-muted)">🏆 Max affordable</span>
          <span class="amount">{{ formatCurrency(recommendedPrice) }}</span>
        </div>
        <div v-else class="callout info">📋 Enter salary &amp; deposit next.</div>
      </div>
      <div v-else class="stat-row">
        <span class="stat-label">House price</span>
        <span class="stat-value">{{ formatCurrency(housePrice) }}</span>
      </div>

      <hr>

      <label class="checkbox-row">
        <input type="checkbox" :checked="usesFHS" @change="$emit('update:usesFHS', ($event.target).checked)" :disabled="!canUseFHS">
        <span class="checkbox-row-text"><strong>Use the First Home Scheme</strong><span>Up to 30% equity share</span></span>
      </label>
      <p v-if="!canUseFHS && fhsDisabledReason" class="disabled-hint">🔒 {{ fhsDisabledReason }}</p>

      <div v-if="usesFHS && fhsAmount > 0" class="fhs-box">
        <div class="stat-row"><span class="stat-label">{{ countyLabel }} area cap</span><span class="stat-value">{{ formatCurrency(fhsCap) }}</span></div>
        <div class="stat-row"><span class="stat-label">FHS contribution</span><span class="stat-value accent">+{{ formatCurrency(fhsAmount) }}</span></div>
        <div class="stat-row"><span class="stat-label">Total with FHS</span><span class="stat-value accent">{{ formatCurrency(totalWithFHS) }}</span></div>
      </div>

      <hr>

      <div class="stat-row"><span class="stat-label">LTV mortgage</span><span class="stat-value">{{ formatCurrency(ltvMortgage) }}</span></div>
      <div class="stat-row"><span class="stat-label">Min deposit</span><span class="stat-value accent">{{ formatCurrency(depositNeeded) }}</span></div>
      <p class="form-hint" style="margin-top:var(--s3)">10% deposit for FTBs, 20% otherwise.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'
import { COUNTIES, PROPERTY_CONDITIONS } from '../utils/constants.js'

const props = defineProps({
  propertyCondition: String, county: String, usesFHS: Boolean, canUseFHS: Boolean,
  fhsAmount: Number, fhsCap: Number, totalWithFHS: Number, ltvMortgage: Number,
  depositNeeded: Number, useMaxAffordable: Boolean, recommendedPrice: Number,
  isFirstTimeBuyer: Boolean, fhsDisabledReason: String, housePrice: Number,
})

defineEmits(['update:propertyCondition','update:county','update:usesFHS'])

const counties = COUNTIES
const propertyConditions = PROPERTY_CONDITIONS

const countyLabel = computed(() => (COUNTIES.find(c => c.value === props.county) || {}).label || props.county)
</script>
