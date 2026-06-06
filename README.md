# 🏡 CanIBuyAHouse.ie — Vue 3 SPA

A modern, private affordability calculator to help determine if you can buy a house in Ireland. Factors in Help to Buy, First Home Scheme, Local Home Authority Loan, stamp duty, and more — all computed **entirely in your browser** (zero data collection).

## ✨ Features

- **Real-time calculations** — instant feedback as you adjust inputs
- **Dark / Light mode** — respects OS preference, saved locally
- **Irish schemes built-in:**
  - First Home Scheme (FHS) with county-level price caps
  - Help to Buy (HTB) with 4-year tax lookback
  - Local Home Authority Loan (LHAL)
  - Vacant Property Refurbishment Grant
- **Dynamic "max affordable price"** mode
- **Comprehensive fee breakdown**: solicitor, stamp duty (with FTB exemption), snag list, valuation, movers
- **Savings goal calculator** — monthly savings target
- **Fully responsive** — desktop, tablet, mobile
- **Accessibility** — semantic HTML, ARIA labels, `:focus-visible` rings, keyboard-friendly

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install & Run

```bash
npm install
npm run dev        # → http://localhost:5173
```

### Production Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the built app
```

## 📁 Project Structure

```
house-calculator/
├── index.html                    # Entry point (SEO / OG / PWA meta)
├── vite.config.js                # Vite + Vue plugin config
├── package.json
├── README.md
└── src/
    ├── main.js                   # App bootstrap
    ├── App.vue                   # Root component (state, theme, layout)
    ├── assets/styles/main.css    # Global design tokens & styles
    ├── components/
    │   ├── PersonInputs.vue      # Salary, FTB status, LHAL
    │   ├── HouseInputs.vue       # Property details, FHS, max affordable
    │   ├── MoneyInputs.vue       # Deposit, HTB, tax years
    │   ├── ResultsDisplay.vue    # Yes / No verdict
    │   ├── FeesInfo.vue          # Fee descriptions (context-aware)
    │   ├── Breakdown.vue         # Financial summary tables
    │   └── SavingsCalculator.vue # Monthly savings goal
    └── utils/
        ├── constants.js          # Scheme caps, rates, dropdown data
        └── calculations.js       # Pure, testable calculation functions
```

## 🎨 Key Architecture Decisions

- **Vue 3 Composition API** with `<script setup>`
- **Reactive state** via `reactive()` in the root component; props down / events up in children
- **Pure calculation functions** — all math is extracted into `calculations.js` (zero side effects)
- **Design tokens** via CSS custom properties — light/dark theme is a single attribute swap
- **Accessibility-first** — focus rings, semantic landmarks, ARIA labels

## ⚠️ Disclaimer

This calculator provides estimates based on Central Bank of Ireland rules and government scheme guidelines as understood at the time of development. Results **do not constitute financial advice** or a guarantee of mortgage approval. Always consult a qualified mortgage advisor.

## 📄 License

MIT — see [LICENSE](LICENSE)

### User Experience
- **Theme Support**: Persistent dark/light mode with localStorage
- **Improved Performance**: Computed properties for efficient reactivity
- **Better Accessibility**: Semantic HTML and proper ARIA labels
- **Responsive Design**: Mobile-first approach with breakpoints

### Corrections Made
- Fixed spelling: "calucated" → "calculated"
- Fixed spelling: "ellibable" → "eligible"
- Fixed spelling: "garuntee" → "guarantee"
- Fixed grammar: "Infromation" → "Information"
- Improved consistency in language and terminology throughout

## 🧮 How It Works

### Loan to Income (LTI)
- **First-time buyers**: 4x gross salary
- **LHAL users**: 4.25x gross salary
- **Second-time buyers**: 3.5x gross salary

### Loan to Value (LTV)
- **1-2 bedrooms**: 20% deposit required (80% LTV)
- **3+ bedrooms**: 10% deposit required (90% LTV)

### First Home Scheme (FHS)
- Government equity contribution up to 30% (or 20% with HTB)
- County-specific price caps apply
- Only for new builds and first-time buyers

### Help to Buy (HTB)
- Tax rebate up to €30,000
- Based on income tax paid over 4 years
- Only for properties under €500,000

## 🔧 Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **Vite**: Next-generation frontend tooling
- **CSS Variables**: Dynamic theming support
- **ES Modules**: Modern JavaScript module system

## 📝 Data Privacy

All calculations are performed locally in your browser. No data is sent to any server or stored anywhere. Your financial information remains completely private.

## ⚠️ Disclaimer

The results provided by this calculator are estimates only and should not be considered financial advice. Actual mortgage amounts and scheme eligibility are subject to bank approval and government criteria. Always consult with financial advisors and lending institutions for accurate information.

## 🤝 Contributing

Issues, feature requests, and pull requests are welcome! Feel free to check the [issues page](https://gitlab.com/Wayno717/house-calculator/issues).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Wayne Thornberry**

- GitLab: [@Wayno717](https://gitlab.com/Wayno717)

## 🙏 Acknowledgments

- Citizens Information for comprehensive housing information
- Irish government housing schemes documentation
- The Vue.js community for excellent documentation and tools

---

**Note**: This tool is for informational purposes only. Property prices, schemes, and regulations are subject to change. Always verify current information with official sources.
