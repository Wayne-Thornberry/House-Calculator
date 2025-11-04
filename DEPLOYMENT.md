# Deployment Guide

This guide covers deploying your Vue 3 House Calculator to various hosting platforms.

## 🚀 Quick Deploy

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## 📦 Hosting Options

### 1. Netlify (Recommended - Easiest)

#### Option A: Drag & Drop
1. Run `npm run build`
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder onto the page
4. Done! Your site is live

#### Option B: Git Integration
1. Push your code to GitLab/GitHub
2. Login to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

**Custom Domain**: 
- Go to Site Settings → Domain Management
- Add your custom domain

---

### 2. Vercel

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

Or use the [Vercel Dashboard](https://vercel.com):
- Import your Git repository
- Build settings auto-detected
- Deploy

---

### 3. GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [vue()],
     base: '/house-calculator/', // Your repo name
     build: {
       outDir: 'dist'
     }
   })
   ```

3. Add deploy script to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to repository Settings
   - Pages section
   - Source: gh-pages branch

---

### 4. GitLab Pages

1. Create `.gitlab-ci.yml`:
   ```yaml
   image: node:18

   pages:
     stage: deploy
     script:
       - npm ci
       - npm run build
       - mv dist public
     artifacts:
       paths:
         - public
     only:
       - main
   ```

2. Update `vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [vue()],
     base: '/house-calculator/', // Your project name
     build: {
       outDir: 'dist'
     }
   })
   ```

3. Push to GitLab - automatic deployment

---

### 5. Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login and initialize:
   ```bash
   firebase login
   firebase init hosting
   ```

3. Configure:
   - Public directory: `dist`
   - Single-page app: `Yes`
   - Setup automatic builds: `No`

4. Deploy:
   ```bash
   npm run build
   firebase deploy
   ```

---

### 6. AWS S3 + CloudFront

1. Build the app:
   ```bash
   npm run build
   ```

2. Create S3 bucket:
   - Enable static website hosting
   - Upload `dist/` contents

3. Setup CloudFront (optional):
   - Create distribution
   - Point to S3 bucket
   - Enable HTTPS

4. Deploy with AWS CLI:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
   ```

---

### 7. Traditional Web Server (Apache/Nginx)

#### Build
```bash
npm run build
```

#### Apache (.htaccess)
Create `dist/.htaccess`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx
Add to nginx config:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Upload `dist/` contents to your web server.

---

## 🔧 Environment Configuration

### Base URL Configuration

If deploying to a subdirectory, update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [vue()],
  base: '/subdirectory/', // or '/' for root
  build: {
    outDir: 'dist'
  }
})
```

### Custom Domain

Most platforms support custom domains:
1. Add CNAME record pointing to hosting provider
2. Configure custom domain in hosting dashboard
3. Enable SSL (usually automatic)

---

## 📋 Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally with `npm run preview`
- [ ] Check all calculations work correctly
- [ ] Test theme toggle (dark/light)
- [ ] Verify on mobile devices
- [ ] Test all links (external resources)
- [ ] Check browser console for errors
- [ ] Verify all images/assets load
- [ ] Test form inputs and validation
- [ ] Check accessibility (keyboard navigation)

---

## 🧪 Testing Production Build Locally

```bash
npm run build
npm run preview
```

Open http://localhost:4173 to test the production build.

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2
      with:
        publish-dir: './dist'
        production-branch: main
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🌐 CDN & Performance

### Cloudflare CDN (Free)

1. Sign up for [Cloudflare](https://cloudflare.com)
2. Add your domain
3. Update nameservers
4. Enable:
   - Auto minify (HTML, CSS, JS)
   - Brotli compression
   - HTTP/2
   - Caching

### Performance Optimization

Already included in Vite build:
- ✅ Minification
- ✅ Tree-shaking
- ✅ Code splitting
- ✅ Asset optimization
- ✅ Gzip compression

---

## 🔒 Security Headers

Add these headers in your hosting platform:

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://www.citizensinformation.ie https://localauthorityhomeloan.ie
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📊 Analytics (Optional)

### Google Analytics

1. Get tracking ID
2. Add to `index.html` before `</head>`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Simple Analytics (Privacy-friendly)

```html
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
```

---

## 🐛 Troubleshooting

### Routes not working (404 errors)
- Add proper rewrite rules (see Apache/Nginx sections above)
- Configure SPA fallback in hosting platform

### Assets not loading
- Check `base` URL in `vite.config.js`
- Verify asset paths are relative

### Build fails
- Run `npm ci` to clean install dependencies
- Check Node.js version (needs v16+)
- Clear `node_modules` and reinstall

### Blank page after deployment
- Check browser console for errors
- Verify `base` URL matches deployment path
- Check if all assets are uploaded

---

## 📱 PWA (Future Enhancement)

To make it a Progressive Web App:

1. Install plugin:
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. Update `vite.config.js`:
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa'
   
   export default defineConfig({
     plugins: [
       vue(),
       VitePWA({
         registerType: 'autoUpdate',
         manifest: {
           name: 'CanIBuyAHouse.ie',
           short_name: 'House Calculator',
           theme_color: '#315c2b'
         }
       })
     ]
   })
   ```

---

## ✅ Post-Deployment

After deploying:

1. Test on actual domain
2. Verify SSL certificate
3. Test on multiple devices
4. Check loading speed
5. Monitor for errors
6. Share with users!

---

## 🔗 Quick Links

- [Netlify Docs](https://docs.netlify.com)
- [Vercel Docs](https://vercel.com/docs)
- [GitHub Pages](https://pages.github.com)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Need Help?** Check the hosting platform's documentation or open an issue on GitLab!

Happy Deploying! 🚀
