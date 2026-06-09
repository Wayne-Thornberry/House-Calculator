<template>
  <div class="card card-accent-amber">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon amber">💰</div>
        <h3>The Money</h3>
      </div>

      <div class="callout info">
        <strong>HTB:</strong> Available for first-time buyers purchasing a new property
        valued up to €500,000. Must be your principal private residence for 5+ years.
      </div>

      <div class="form-group">
        <label class="form-label" for="depositAmount">Available deposit</label>
        <input id="depositAmount" type="number" :value="depositAmount" @input="$emit('update:depositAmount', Number(($event.target).value))" min="0" max="9999999" step="1000" placeholder="e.g. 50,000">
        <p class="form-hint">Cash you have ready to put down right now.</p>
      </div>

      <hr>

      <label class="checkbox-row">
        <input type="checkbox" :checked="usesHTB" @change="$emit('update:usesHTB', ($event.target).checked)" :disabled="!canUseHTB">
        <span class="checkbox-row-text"><strong>Use Help to Buy</strong><span>Tax refund up to €30,000</span></span>
      </label>
      <p v-if="!canUseHTB && htbDisabledReason" class="disabled-hint">🔒 {{ htbDisabledReason }}</p>
      <a href="https://www.citizensinformation.ie/en/housing/owning-a-home/help-with-buying-a-home/help-to-buy-scheme/" target="_blank" rel="noopener noreferrer" class="inline-link">Learn about HTB</a>

      <div v-if="usesHTB">
        <div class="tax-grid">
          <div class="form-group">
            <label class="form-label" for="ty1">Year 1 tax paid</label>
            <input id="ty1" type="number" min="0" step="1000" :value="taxYear1" @input="$emit('update:taxYear1', Number(($event.target).value))" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label" for="ty2">Year 2 tax paid</label>
            <input id="ty2" type="number" min="0" step="1000" :value="taxYear2" @input="$emit('update:taxYear2', Number(($event.target).value))" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label" for="ty3">Year 3 tax paid</label>
            <input id="ty3" type="number" min="0" step="1000" :value="taxYear3" @input="$emit('update:taxYear3', Number(($event.target).value))" placeholder="0">
          </div>
          <div class="form-group">
            <label class="form-label" for="ty4">Year 4 tax paid</label>
            <input id="ty4" type="number" min="0" step="1000" :value="taxYear4" @input="$emit('update:taxYear4', Number(($event.target).value))" placeholder="0">
          </div>
        </div>

        <div class="stat-row">
          <span class="stat-label">HTB refund</span>
          <span class="stat-value accent">{{ formatCurrency(htbAmount) }}</span>
        </div>

        <details>
          <summary>How is HTB calculated?</summary>
          <p>Enter the Income Tax (including USC &amp; PRSI) you paid in each of the last 4 years — find it on <a href="https://www.revenue.ie/en/home.aspx" target="_blank" rel="noopener noreferrer">revenue.ie</a> under 'Documents'.</p>
          <p><strong>HTB refund</strong> is the <em>lower</em> of:</p>
          <ul>
            <li>5% of the purchase price (up to €500k), or</li>
            <li>Total income tax paid over 4 years</li>
          </ul>
          <p>Max refund: <strong>€30,000</strong>. When used with FHS, the FHS share drops from 30% to 20%.</p>
        </details>
      </div>

      <div class="stat-row" style="border-top: 2px solid var(--border); margin-top: var(--s4); padding-top: var(--s4);">
        <span class="stat-label" style="font-weight: 700; color: var(--text);">Total Down Payment</span>
        <span class="stat-value accent">{{ formatCurrency(totalDownPayment) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'

const props = defineProps({
  depositAmount: Number, usesHTB: Boolean, canUseHTB: Boolean,
  taxYear1: Number, taxYear2: Number, taxYear3: Number, taxYear4: Number,
  htbAmount: Number, htbDisabledReason: String,
})

defineEmits(['update:depositAmount','update:usesHTB','update:taxYear1','update:taxYear2','update:taxYear3','update:taxYear4'])

const totalDownPayment = computed(() => props.depositAmount + props.htbAmount)
</script>
