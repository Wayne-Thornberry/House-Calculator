# Quick Start Guide

## 🚀 Running the Application

### Development Mode

1. Open a terminal in the project root directory
2. Run the following command:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`
4. The application will hot-reload when you make changes

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```
2. Preview the production build:
   ```bash
   npm run preview
   ```

## 📂 File Organization

- **`src/components/`** - Vue components (PersonInputs, HouseInputs, etc.)
- **`src/utils/`** - Pure calculation functions and constants
- **`src/assets/styles/`** - Global CSS with theme variables
- **`src/App.vue`** - Main application component with state management

## 🎨 Theme System

The application supports dark and light modes:
- Click the theme toggle button (🌙/☀️) in the top right
- Theme preference is saved in localStorage
- Uses CSS custom properties for dynamic theming

## 🔧 Customization

### Modifying Calculations

Edit `src/utils/calculations.js` to adjust calculation logic.

### Updating Constants

Edit `src/utils/constants.js` to update:
- County price caps
- LTI multipliers
- Fee amounts
- Deposit rates

### Styling Changes

Edit `src/assets/styles/main.css` to modify:
- Color schemes
- Spacing
- Typography
- Responsive breakpoints

## 📝 Key Features Implemented

✅ Vue 3 Composition API  
✅ Component-based architecture  
✅ Dark/Light theme with persistence  
✅ Reactive state management  
✅ Pure calculation functions  
✅ Responsive design  
✅ Improved code readability  
✅ Fixed spelling and grammar errors  
✅ Modern ES6+ JavaScript  
✅ Vite for fast development

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### Build Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Theme Not Persisting
Check browser localStorage settings - it must be enabled for theme persistence.

## 📚 Next Steps

1. ✅ Test all calculations with various inputs
2. ✅ Verify theme switching works correctly
3. ✅ Test responsive design on mobile devices
4. ✅ Review accessibility features
5. Consider adding unit tests for calculation functions
6. Consider adding form validation
7. Consider adding input history/save feature

## 🎯 Migration from Old Version

The old files are still in the `public/` directory but are no longer used:
- `public/index.html` (old)
- `public/js/site.js` (old)
- `public/css/site.css` (old)

These can be removed after verifying the new version works correctly.
