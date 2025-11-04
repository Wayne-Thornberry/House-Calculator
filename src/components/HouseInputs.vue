<template>
  <div class="house-inputs">
    <div class="card">
      <div class="card-header">
        <h3 class="text-center text-white">The House</h3>
      </div>
      <div class="card-body">
        <div>
          <p><b>Important: The First Home Scheme and Help to Buy are only available for new builds or self-build properties. 
          Second-hand (existing) properties do not qualify for these schemes.</b></p>

          <label for="pcSelect">I want to buy a...</label>
          <select
            class="form-select"
            :value="propertyCondition"
            @change="$emit('update:propertyCondition', $event.target.value)"
            id="pcSelect"
          >
            <option v-for="option in propertyConditions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>

          <label for="cSelect">The house is located in County...</label>
          <select
            class="form-select"
            :value="county"
            @change="$emit('update:county', $event.target.value)"
            id="cSelect"
          >
            <option v-for="county in counties" :key="county.value" :value="county.value">
              {{ county.label }}
            </option>
          </select>

          <label for="ptSelect">The property is a...</label>
          <select
            class="form-select"
            :value="propertyType"
            @change="$emit('update:propertyType', $event.target.value)"
            id="ptSelect"
          >
            <option v-for="type in propertyTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>

          <label for="bedsOption">Number of bedrooms...</label>
          <select
            class="form-select"
            :value="bedrooms"
            @change="$emit('update:bedrooms', Number($event.target.value))"
            id="bedsOption"
          >
            <option v-for="num in bedroomOptions" :key="num" :value="num">
              {{ num }}
            </option>
          </select>

          <div>
            <input
              type="checkbox"
              class="form-check-input"
              :checked="isDerelict"
              @change="$emit('update:isDerelict', $event.target.checked)"
              id="isDer"
            />
            <label for="isDer">Is this building derelict?</label>
            <a
              href="https://www.citizensinformation.ie/en/environment/buildings-and-structures/derelict-sites/"
              target="_blank"
              rel="noopener noreferrer"
            >
              What's that?
            </a>
          </div>
        </div>

        <hr />

        <div>
          <input
            type="checkbox"
            class="form-check-input"
            :checked="useMaxAffordable"
            @change="$emit('update:useMaxAffordable', $event.target.checked)"
            id="useMaxAffordable"
          />
          <label for="useMaxAffordable">Calculate maximum affordable house price</label>
          
          <p style="font-size: 1rem; margin-top: 0.5rem; font-weight: bold; color: var(--color-brand-primary);">
            Maximum affordable: {{ recommendedPrice > 0 ? formatCurrency(recommendedPrice) : '€0' }}
          </p>
          <p style="font-size: 0.9rem; margin-top: 0.5rem; font-style: italic;">
            This will calculate the theoretical maximum house price you could afford based on your mortgage capacity, 
            deposit, and any enabled schemes (FHS, HTB).
          </p>
        </div>

        <div>
          <label class="form-check-label">House Price</label>
          <input
            type="number"
            :value="housePrice"
            @input="$emit('update:housePrice', Number($event.target.value))"
            class="form-control"
            step="5000"
            min="30000"
            max="1000000"
            :disabled="useMaxAffordable"
          />
        </div>

        <hr />

        <div>
          <input
            type="checkbox"
            class="form-check-input"
            :checked="usesFHS"
            @change="$emit('update:usesFHS', $event.target.checked)"
            :disabled="!canUseFHS && !useMaxAffordable"
            id="useFHS"
          />
          <label for="useFHS">Use the First Home Scheme</label>
          <a href="https://www.firsthomescheme.ie/" target="_blank" rel="noopener noreferrer">
            What's that?
          </a>
        </div>

        <div v-if="usesFHS && fhsAmount > 0">
          <hr />
          <label class="text-uppercase">{{ countyLabel }} area value {{ formatCurrency(fhsCap) }}</label>
          <br />
          <label>FHS Value</label>
          <output>+{{ formatCurrency(fhsAmount) }}</output>
          <br />
          <label>Home Value With FHS</label>
          <output>{{ formatCurrency(totalWithFHS) }}</output>
        </div>

        <hr />

        <div>
          <b><label>Loan to Value (LTV)</label></b>
          <output>{{ formatCurrency(ltvMortgage) }}</output>
          <br />
          <label>Minimum Deposit Required</label>
          <output>{{ formatCurrency(depositNeeded) }}</output>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">
            <strong>Central Bank Rules:</strong> You need a minimum deposit of 10% for properties with 3+ bedrooms, 
            or 20% for properties with 1-2 bedrooms. First-time buyers may access up to 90% LTV on the first €250k 
            and 80% on the remainder.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../utils/calculations.js'
import {
  COUNTIES,
  PROPERTY_CONDITIONS,
  PROPERTY_TYPES,
  BEDROOM_OPTIONS
} from '../utils/constants.js'

const props = defineProps({
  propertyCondition: String,
  county: String,
  propertyType: String,
  bedrooms: Number,
  isDerelict: Boolean,
  housePrice: Number,
  usesFHS: Boolean,
  canUseFHS: Boolean,
  fhsAmount: Number,
  fhsCap: Number,
  totalWithFHS: Number,
  ltvMortgage: Number,
  depositNeeded: Number,
  useMaxAffordable: Boolean,
  recommendedPrice: Number
})

defineEmits([
  'update:propertyCondition',
  'update:county',
  'update:propertyType',
  'update:bedrooms',
  'update:isDerelict',
  'update:housePrice',
  'update:usesFHS',
  'update:useMaxAffordable'
])

const counties = COUNTIES
const propertyConditions = PROPERTY_CONDITIONS
const propertyTypes = PROPERTY_TYPES
const bedroomOptions = BEDROOM_OPTIONS

const countyLabel = computed(() => {
  const found = COUNTIES.find(c => c.value === props.county)
  return found ? found.label : props.county
})
</script>
