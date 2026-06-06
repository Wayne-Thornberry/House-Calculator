<template>
  <div class="card">
    <div class="card-header">
      <div class="card-header-icon green">📊</div>
      <h3>The Breakdown</h3>
    </div>
    <div class="card-body">
      <h4 style="font-size: var(--text-sm); margin-bottom: var(--s3);">Big Picture</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Item</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>House Price</td><td>{{ formatCurrency(housePrice) }}</td></tr>
            <tr><td>Borrowed Amount</td><td>{{ formatCurrency(borrowedAmount) }}</td></tr>
            <tr><td>Down Payment</td><td>{{ formatCurrency(depositAmount) }}</td></tr>
            <tr><td>First Home Scheme</td><td>{{ formatCurrency(fhsAmount) }}</td></tr>
            <tr><td>Help To Buy</td><td>{{ formatCurrency(htbAmount) }}</td></tr>
          </tbody>
        </table>
      </div>

      <hr>

      <h4 style="font-size: var(--text-sm); margin-bottom: var(--s3);">Fees &amp; Extras</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Item</th><th>Amount</th></tr></thead>
          <tbody>
            <tr><td>Solicitor</td><td>{{ formatCurrency(fees.solicitor) }}</td></tr>
            <tr>
              <td>
                Stamp Duty
                <span v-if="stampDuty === 0 && isFirstTimeBuyer && housePrice > 0" class="badge badge-green">FTB exempt</span>
              </td>
              <td>{{ formatCurrency(stampDuty) }}</td>
            </tr>
            <tr><td>Snag List</td><td>{{ formatCurrency(fees.snagList) }}</td></tr>
            <tr><td>Valuation</td><td>{{ formatCurrency(fees.valuation) }}</td></tr>
            <tr><td>Movers</td><td>{{ formatCurrency(fees.movers) }}</td></tr>
          </tbody>
        </table>
      </div>

      <div v-if="isDerelict">
        <hr>
        <h4 style="font-size: var(--text-sm); margin-bottom: var(--s3);">Grants</h4>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Grant</th><th>Value</th></tr></thead>
            <tbody>
              <tr>
                <td><a href="https://www.citizensinformation.ie/en/housing/housing-grants-and-schemes/local-authority-housing-grants-and-supports/vacant-property-refurbishment-grant/" target="_blank" rel="noopener noreferrer">Vacant Property Refurbishment Grant</a></td>
                <td>{{ formatCurrency(fees.vacantPropertyGrant) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatCurrency } from '../utils/calculations.js'
import { FEES } from '../utils/constants.js'

defineProps({
  housePrice: Number, borrowedAmount: Number, depositAmount: Number,
  fhsAmount: Number, htbAmount: Number, stampDuty: Number,
  isDerelict: Boolean, isFirstTimeBuyer: Boolean,
})

const fees = FEES
</script>
