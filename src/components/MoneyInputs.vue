<template>
  <div class="money-inputs">
    <div class="card">
      <div class="card-header">
        <h3 class="text-center text-white">The Money</h3>
      </div>
      <div class="card-body">
        <p>
          <b>Help to Buy Eligibility:</b> Available for first-time buyers purchasing or building a new property valued up to €500,000. 
          You must occupy the property as your principal private residence for at least 5 years.
        </p>

        <div>
          <label>Available deposit amount</label>
          <input
            type="number"
            :value="depositAmount"
            @input="$emit('update:depositAmount', Number($event.target.value))"
            class="form-control"
            min="0"
            max="9999999"
            step="1000"
          />
        </div>
        
        <p>
          This is the amount of money you have available to put down as a deposit
          right now if you were to buy a house.
        </p>

        <hr />

        <div>
          <input
            type="checkbox"
            class="form-check-input"
            :checked="usesHTB"
            @change="$emit('update:usesHTB', $event.target.checked)"
            :disabled="!canUseHTB"
            id="useHTB"
          />
          <label for="useHTB">Use the Help To Buy Scheme</label>
          <a
            href="https://www.citizensinformation.ie/en/housing/owning-a-home/help-with-buying-a-home/help-to-buy-scheme/"
            target="_blank"
            rel="noopener noreferrer"
          >
            What's that?
          </a>
        </div>

        <div v-if="usesHTB" class="tax-income-container">
          <ul class="list-inline">
            <li>
              <label class="form-label">Year 1 Tax Income</label>
              <input
                type="number"
                min="0"
                step="1000"
                :value="taxYear1"
                @input="$emit('update:taxYear1', Number($event.target.value))"
                class="form-control"
              />
            </li>

            <li>
              <label class="form-label">Year 2 Tax Income</label>
              <input
                type="number"
                min="0"
                step="1000"
                :value="taxYear2"
                @input="$emit('update:taxYear2', Number($event.target.value))"
                class="form-control"
              />
            </li>

            <li>
              <label class="form-label">Year 3 Tax Income</label>
              <input
                type="number"
                min="0"
                step="1000"
                :value="taxYear3"
                @input="$emit('update:taxYear3', Number($event.target.value))"
                class="form-control"
              />
            </li>

            <li>
              <label class="form-label">Year 4 Tax Income</label>
              <input
                type="number"
                min="0"
                step="1000"
                :value="taxYear4"
                @input="$emit('update:taxYear4', Number($event.target.value))"
                class="form-control"
              />
            </li>

            <li>
              <label class="form-label">Total</label>
              <label class="form-label">{{ formatCurrency(htbAmount) }}</label>
            </li>
          </ul>

          <p>
            <strong>How to calculate:</strong> Enter the Income Tax (including USC and PRSI) you paid in each of the previous 4 years. 
            Find this on your statement of liability on
            <a href="https://www.revenue.ie/en/home.aspx" target="_blank" rel="noopener noreferrer">
              revenue.ie
            </a> under 'Documents'.
          </p>
          
          <p>
            <strong>HTB Amount:</strong> You can claim back up to €30,000, which is calculated as:
          </p>
          <ul style="font-size: 0.9rem;">
            <li>5% of the purchase price (for properties up to €500,000), OR</li>
            <li>The total income tax you paid over the previous 4 years</li>
            <li>Whichever is lower, up to a maximum of €30,000</li>
          </ul>

          <p>
            <b>Important:</b> If you're using both First Home Scheme (FHS) and Help to Buy (HTB), the FHS equity 
            contribution is reduced from 30% to 20% when HTB is applied.
            <a
              href="https://www.firsthomescheme.ie/media/4nda0lnn/0827-first-homes-brochure_r14.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              See official FHS guidelines
            </a>
          </p>

          <p>
            <strong>Application Process:</strong> HTB can be claimed either:
          </p>
          <ul style="font-size: 0.9rem;">
            <li>During the mortgage application (you'll receive a HTB certificate to present to your lender), or</li>
            <li>After purchase completion (claim a refund from Revenue within 4 years)</li>
          </ul>
          
          <p style="font-size: 0.9rem;">
            Note: While HTB reduces your required cash deposit, most lenders still want to see evidence of genuine savings 
            (typically at least 10% in cash) as proof of your ability to manage finances.
          </p>
        </div>

        <label class="form-label">Total Down Payment</label>
        <b><label class="form-label">{{ formatCurrency(totalDownPayment) }}</label></b>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'

const props = defineProps({
  depositAmount: Number,
  usesHTB: Boolean,
  canUseHTB: Boolean,
  taxYear1: Number,
  taxYear2: Number,
  taxYear3: Number,
  taxYear4: Number,
  htbAmount: Number
})

defineEmits([
  'update:depositAmount',
  'update:usesHTB',
  'update:taxYear1',
  'update:taxYear2',
  'update:taxYear3',
  'update:taxYear4'
])

const totalDownPayment = computed(() => {
  return props.depositAmount + props.htbAmount
})
</script>
