<template>
  <div class="card card-accent-blue">
    <div class="card-body">
      <div class="card-title-row">
        <div class="card-title-icon blue">👤</div>
        <h3>About You</h3>
      </div>

      <label class="checkbox-row">
        <input type="checkbox" :checked="usesLHAL" @change="$emit('update:usesLHAL', ($event.target).checked)" :disabled="usesFHS">
        <span class="checkbox-row-text"><strong>Local Authority Home Loan</strong><span>Higher LTI (4.25×) — cannot combine with FHS</span></span>
      </label>
      <p v-if="usesFHS" class="disabled-hint">🔒 Cannot combine with First Home Scheme.</p>

      <hr>

      <div class="tabs">
        <button class="tab-btn" :class="{ active: activeTab === 'person1' }" @click="activeTab = 'person1'" type="button">Person One</button>
        <button class="tab-btn" :class="{ active: activeTab === 'person2' }" @click="activeTab = 'person2'" type="button">Person Two</button>
      </div>

      <div v-show="activeTab === 'person1'">
        <div class="form-group">
          <label class="form-label" for="salary1">Gross Annual Salary</label>
          <input id="salary1" type="number" :value="grossSalary1" @input="$emit('update:grossSalary1', Number(($event.target).value))" min="0" step="2500" placeholder="e.g. 45,000">
        </div>
      </div>
      <div v-show="activeTab === 'person2'">
        <div class="form-group">
          <label class="form-label" for="salary2">Gross Annual Salary</label>
          <input id="salary2" type="number" :value="grossSalary2" @input="$emit('update:grossSalary2', Number(($event.target).value))" min="0" step="2500" placeholder="e.g. 35,000">
        </div>
      </div>

      <div class="stat-row">
        <span class="stat-label">Loan-to-Income (LTI) estimate</span>
        <span class="stat-value accent">{{ formatCurrency(maxMortgage) }}</span>
      </div>

      <details>
        <summary>How is LTI calculated?</summary>
        <p>Based on Central Bank of Ireland lending rules:</p>
        <ul>
          <li><strong>Second-time buyers:</strong> up to 3.5× combined gross income</li>
          <li><strong>First-time buyers:</strong> up to 4× combined gross income</li>
          <li><strong>LHAL:</strong> approximately 4.25× combined gross income</li>
        </ul>
        <p>This is a guideline only. The actual amount depends on your lender's assessment of your income, outgoings, and credit history.</p>
        <p>External calculators:</p>
        <ul>
          <li><a href="https://personalbanking.bankofireland.com/borrow/mortgages/calculators/mortgage-calculator/" target="_blank" rel="noopener noreferrer">Bank of Ireland</a></li>
          <li><a href="https://aib.ie/our-products/mortgages/mortgage-calculator" target="_blank" rel="noopener noreferrer">AIB</a></li>
          <li><a href="https://localauthorityhomeloan.ie/calculator/" target="_blank" rel="noopener noreferrer">LHAL Calculator</a></li>
        </ul>
      </details>

      <hr>

      <div class="form-group">
        <label class="form-label" for="customMortgage">Got a mortgage quote?</label>
        <p class="form-hint">If you have a specific quote from a lender, enter it here. Leave at 0 to use the estimate above.</p>
        <input id="customMortgage" type="number" :value="customMortgage" @input="$emit('update:customMortgage', Number(($event.target).value))" min="0" step="2500" placeholder="0">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatCurrency } from '../utils/calculations.js'

defineProps({
  isFirstTimeBuyer: Boolean,
  usesLHAL: Boolean,
  usesFHS: Boolean,
  grossSalary1: Number,
  grossSalary2: Number,
  customMortgage: Number,
  maxMortgage: Number,
})

defineEmits(['update:usesLHAL','update:grossSalary1','update:grossSalary2','update:customMortgage'])

const activeTab = ref('person1')
</script>
