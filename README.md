# 🏡 CanIBuyAHouse.ie - Vue 3 SPA

A modern, interactive calculator to help determine if you can afford to buy a house in Ireland. This tool considers various schemes, grants, and financial factors to give you a comprehensive overview of your home buying potential.

## ✨ Features

- **Modern Vue 3 Architecture**: Built with Vue 3 Composition API for better performance and maintainability
- **Component-Based Design**: Modular, reusable components for easy maintenance
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Real-time Calculations**: Instant feedback as you adjust your inputs
- **Irish Housing Schemes Support**:
  - First Home Scheme (FHS)
  - Help to Buy (HTB) Scheme
  - Local Home Authority Loan (LHAL)
- **Comprehensive Fee Breakdown**: Includes solicitor fees, stamp duty, and other costs
- **Savings Calculator**: Estimates monthly savings needed to reach your deposit goal
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://gitlab.com/Wayno717/house-calculator.git
cd house-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to any static hosting service.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
house-calculator/
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css          # Global styles with CSS variables
│   ├── components/
│   │   ├── PersonInputs.vue      # Salary and buyer type inputs
│   │   ├── HouseInputs.vue       # Property details inputs
│   │   ├── MoneyInputs.vue       # Deposit and HTB inputs
│   │   ├── ResultsDisplay.vue    # Affordability results
│   │   ├── FeesInfo.vue          # Information about fees
│   │   ├── Breakdown.vue         # Financial breakdown table
│   │   └── SavingsCalculator.vue # Monthly savings calculator
│   ├── utils/
│   │   ├── constants.js          # Constants and data
│   │   └── calculations.js       # Pure calculation functions
│   ├── App.vue                   # Main application component
│   └── main.js                   # Application entry point
├── public/                       # Static assets (legacy)
├── index.html                    # HTML entry point
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                     # This file
```

## 🎨 Key Improvements

### Architecture
- **Vue 3 Composition API**: Modern reactive patterns with better code organization
- **Component Modularity**: Each section is now a reusable component
- **Separation of Concerns**: Business logic separated from presentation

### Code Quality
- **Pure Functions**: Calculations are pure, testable functions
- **Constants Management**: Centralized configuration data
- **Type Safety**: Proper prop validation and type checking
- **Readability**: Clear naming conventions and code documentation

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
