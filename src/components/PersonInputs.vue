<template>
  <div class="person-inputs">
    <div class="card">
      <div class="card-header">
        <h3 class="text-center text-white">The 'You'</h3>
      </div>
      <div class="card-body">
        <div>
          <p><b>Note: Only first-time buyers can avail of the First Home Scheme and Help to Buy incentives. These schemes are only available for new builds or self-builds.</b></p>
          
          <div>
            <input
              type="checkbox"
              class="form-check-input"
              :checked="isFirstTimeBuyer"
              @change="$emit('update:isFirstTimeBuyer', $event.target.checked)"
              id="amFtb"
            />
            <label for="amFtb">Are you a first-time buyer?</label>
          </div>
          
          <div>
            <input
              type="checkbox"
              class="form-check-input"
              :checked="usesLHAL"
              @change="$emit('update:usesLHAL', $event.target.checked)"
              id="useLHAL"
            />
            <label for="useLHAL">I intend to use the Local Home Authority Loan</label>
            <a href="https://localauthorityhomeloan.ie/" target="_blank" rel="noopener noreferrer">
              What's that?
            </a>
          </div>
        </div>

        <hr />

        <nav>
          <div class="nav-tabs">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'person1' }"
              @click="activeTab = 'person1'"
            >
              Person One
            </button>
            <button
              class="nav-link"
              :class="{ active: activeTab === 'person2' }"
              @click="activeTab = 'person2'"
            >
              Person Two
            </button>
          </div>
        </nav>

        <div class="tab-content">
          <div class="tab-pane" :class="{ active: activeTab === 'person1' }">
            <label class="form-check-label">Gross Salary</label>
            <input
              type="number"
              :value="grossSalary1"
              @input="$emit('update:grossSalary1', Number($event.target.value))"
              class="form-control"
              min="0"
              step="2500"
            />
          </div>
          
          <div class="tab-pane" :class="{ active: activeTab === 'person2' }">
            <label class="form-check-label">Gross Salary</label>
            <input
              type="number"
              :value="grossSalary2"
              @input="$emit('update:grossSalary2', Number($event.target.value))"
              class="form-control"
              min="0"
              step="2500"
            />
          </div>
        </div>

        <hr />

        <div>
          <b><label>Loan To Income (LTI)</label></b>
          <output>{{ formatCurrency(maxMortgage) }}</output>
          <hr />
          
          <a
            href="https://www.citizensinformation.ie/en/housing/owning-a-home/help-with-buying-a-home/taking-out-a-mortgage/"
            target="_blank"
            rel="noopener noreferrer"
          >
            How is the above value calculated?
          </a>
          
          <p>** The estimated maximum mortgage is calculated using Central Bank of Ireland lending rules:</p>
          <ul>
            <li><strong>Second-time buyers:</strong> Up to 3.5× combined gross annual income (this is the general rule, though exceptions may apply for up to 20% of a lender's lending)</li>
            <li><strong>First-time buyers:</strong> Up to 4× combined gross annual income (exceptions may apply for up to 20% of a lender's lending)</li>
            <li><strong>LHAL buyers:</strong> Approximately 4.25× combined gross annual income (Local Authority loans may have different criteria)</li>
          </ul>
          
          <p>
            <strong>Important:</strong> The above calculation is a guideline only. Banks assess affordability based on your income, outgoings, 
            credit history, and stress tests. The actual amount you can borrow will be determined by your lender. 
            Use the calculators below for a more detailed assessment.
          </p>
          
          <a
            href="https://personalbanking.bankofireland.com/borrow/mortgages/calculators/mortgage-calculator/"
            target="_blank"
            rel="noopener noreferrer"
          >
            BOI Mortgage Calculator
          </a>
          <br />
          <a href="https://aib.ie/our-products/mortgages/mortgage-calculator" target="_blank" rel="noopener noreferrer">
            AIB Mortgage Calculator
          </a>
          <br />
          <a href="https://localauthorityhomeloan.ie/calculator/" target="_blank" rel="noopener noreferrer">
            LHAL Calculator
          </a>
          
          <hr />
          
          <label>Have a mortgage quote instead?</label>
          <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">
            If you have received a specific mortgage quote from a lender, enter it here. Leave at 0 to use the calculated estimate above.
          </p>
          <input
            type="number"
            :value="customMortgage"
            @input="$emit('update:customMortgage', Number($event.target.value))"
            class="form-control"
            min="0"
            step="2500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatCurrency } from '../utils/calculations.js'

const props = defineProps({
  isFirstTimeBuyer: Boolean,
  usesLHAL: Boolean,
  grossSalary1: Number,
  grossSalary2: Number,
  customMortgage: Number,
  maxMortgage: Number
})

defineEmits([
  'update:isFirstTimeBuyer',
  'update:usesLHAL',
  'update:grossSalary1',
  'update:grossSalary2',
  'update:customMortgage'
])

const activeTab = ref('person1')
</script>
