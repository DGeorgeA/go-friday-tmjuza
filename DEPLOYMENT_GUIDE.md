
# GoFriday - Complete Deployment Guide for GitHub Pages

## 🎯 Overview

This guide will help you deploy the GoFriday app to GitHub Pages at **https://gofriday.shop**.

## 📋 Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Domain `gofriday.shop` (DNS access required)

## 🚀 Quick Start

### Step 1: Build the Web Version

```bash
# Install dependencies
npm install

# Build for production
npm run build:web
```

This creates a `dist/` folder with all production-ready files.

### Step 2: Verify Build Output

Check that `dist/` contains:
- ✅ `index.html` - Main entry point
- ✅ `manifest.json` - PWA manifest
- ✅ `_redirects` - Routing configuration
- ✅ `CNAME` - Custom domain file
- ✅ `_expo/static/` - Minified JS/CSS bundles
- ✅ `assets/` - All images, fonts, and resources

### Step 3: Deploy to GitHub Pages

#### Option A: Automatic Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy GoFriday to GitHub Pages"
   git push origin main
   ```

2. **Enable GitHub Actions:**
   - Go to your repository on GitHub
   - Navigate to **Settings → Pages**
   - Under "Build and deployment", select **Source: GitHub Actions**

3. **Wait for Deployment:**
   - GitHub Actions will automatically build and deploy
   - Check the **Actions** tab for progress
   - Deployment typically takes 2-5 minutes

#### Option B: Manual Deployment

```bash
# Install gh-pages globally
npm install -g gh-pages

# Deploy the dist folder
gh-pages -d dist
```

## 🌐 Custom Domain Setup

### Configure DNS Records

Add these DNS records for `gofriday.shop`:

| Type  | Name | Value                |
|-------|------|----------------------|
| A     | @    | 185.199.108.153      |
| A     | @    | 185.199.109.153      |
| A     | @    | 185.199.110.153      |
| A     | @    | 185.199.111.153      |
| CNAME | www  | yourusername.github.io |

### Enable Custom Domain on GitHub

1. Go to **Settings → Pages**
2. Under "Custom domain", enter: `gofriday.shop`
3. Click **Save**
4. Wait for DNS check (can take up to 24 hours)
5. Enable **Enforce HTTPS** once DNS is verified

## 📁 Build Output Structure

```
dist/
├── index.html                    # Main HTML file
├── manifest.json                 # PWA manifest
├── favicon.ico                   # Site favicon
├── _redirects                    # Netlify-style redirects for SPA routing
├── CNAME                         # Custom domain configuration
├── robots.txt                    # SEO robots file
├── sitemap.xml                   # SEO sitemap
├── _expo/
│   └── static/
│       ├── js/
│       │   ├── entry-[hash].js   # Main app bundle (minified)
│       │   ├── vendor-[hash].js  # Third-party libraries
│       │   └── *.chunk.js        # Code-split chunks
│       └── css/
│           └── *.css             # Minified stylesheets
└── assets/
    ├── images/
    │   ├── natively-dark.png
    │   ├── final_quest_240x240.png
    │   └── *.png
    ├── exercises/
    │   ├── photo_stop_smoking.webp
    │   ├── photo_move_body.webp
    │   ├── photo_eat_awareness.webp
    │   └── blossom-*.svg
    └── fonts/
        └── *.ttf
```

## ✅ Features Included

### Core Functionality
- ✅ All impulse hubs (Stop Smoking, Move Body, Eat with Awareness, Return to Calm, Steady Breath, Stop Doomscrolling)
- ✅ Exercise player with 5-second intervals between tasks
- ✅ Completion popup with heavy pink blossom animation
- ✅ Enlarged Japanese fonts in completion message
- ✅ Slowdown/fast-forward controls (minimalistic Japanese style)
- ✅ B&W motivational background photos
- ✅ Breathing exercises with animations
- ✅ Progress tracking and monkhood badges

### Design & UX
- ✅ Japanese minimalism aesthetic
- ✅ Pink blossom theme throughout
- ✅ Responsive mobile and desktop layouts
- ✅ Smooth animations and transitions
- ✅ Accessibility support (reduced motion)

### Performance
- ✅ Minified JavaScript and CSS
- ✅ Code splitting for faster initial load
- ✅ Optimized images (WebP format)
- ✅ Service worker for offline support
- ✅ Asset caching for repeat visits

### SEO & PWA
- ✅ Meta tags for social sharing
- ✅ Sitemap for search engines
- ✅ Robots.txt configuration
- ✅ PWA manifest for "Add to Home Screen"
- ✅ HTTPS support via GitHub Pages

## 🧪 Testing Before Deployment

### Test Production Build Locally

```bash
# Build the app
npm run build:web

# Serve locally
npx serve dist

# Open in browser
# http://localhost:3000
```

### Test Checklist

- [ ] Home page loads correctly
- [ ] All impulse hubs are accessible
- [ ] Exercise player works with all tasks
- [ ] Completion popup appears with animation
- [ ] Slowdown/fast-forward buttons function
- [ ] 5-second intervals between tasks work
- [ ] Mobile layout is responsive
- [ ] Desktop layout is responsive
- [ ] All images and fonts load
- [ ] Navigation works (no 404s)
- [ ] Browser back button works
- [ ] Refresh on any page works

## 🔧 Troubleshooting

### Issue: Blank Page After Deploy

**Solution:**
1. Check browser console for errors
2. Verify `_redirects` file is in `dist/`
3. Clear browser cache and hard reload (Ctrl+Shift+R)
4. Check GitHub Pages deployment logs

### Issue: 404 on Refresh

**Solution:**
- Ensure `_redirects` file contains: `/*    /index.html   200`
- Verify file is copied to `dist/` during build

### Issue: Custom Domain Not Working

**Solution:**
1. Verify DNS records are correct
2. Wait up to 24 hours for DNS propagation
3. Check CNAME file contains `gofriday.shop`
4. Disable and re-enable custom domain in GitHub Settings

### Issue: Assets Not Loading

**Solution:**
1. Check that assets are in `dist/assets/`
2. Verify paths use relative references (no leading `/`)
3. Check browser network tab for 404s
4. Rebuild with `npm run build:web`

### Issue: Routing Not Working

**Solution:**
1. Verify `_redirects` file is present
2. Check that `expo-router` is configured correctly
3. Test locally with `npx serve dist`

## 📊 Performance Optimization

### Current Optimizations

1. **Code Splitting**: Routes are automatically split into separate chunks
2. **Tree Shaking**: Unused code is removed from bundles
3. **Minification**: All JS/CSS is minified
4. **Image Optimization**: WebP format for photos
5. **Lazy Loading**: Components load on demand
6. **Caching**: Service worker caches assets

### Expected Performance

- **First Load**: 1-3 seconds
- **Subsequent Loads**: < 1 second (cached)
- **Bundle Size**: 2-5 MB (gzipped)
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

## 🔄 Continuous Deployment

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` file automates deployment:

```yaml
on:
  push:
    branches:
      - main
```

**What it does:**
1. Checks out code
2. Installs dependencies
3. Builds web version
4. Deploys to GitHub Pages
5. Updates custom domain

**Trigger a deployment:**
```bash
git push origin main
```

## 📱 Mobile App Deployment (Future)

While this guide focuses on web deployment, the app is also ready for:

- **iOS**: Build with `expo build:ios` or EAS Build
- **Android**: Build with `expo build:android` or EAS Build

## 🎨 Customization

### Update Branding

1. **App Name**: Edit `app.json` → `expo.name`
2. **Colors**: Edit `styles/commonStyles.ts`
3. **Logo**: Replace `assets/images/natively-dark.png`
4. **Favicon**: Replace `assets/images/final_quest_240x240.png`

### Update Content

1. **Impulses**: Edit `data/impulses.ts`
2. **Exercises**: Edit `data/impulses.ts` → `impulseHubs`
3. **Breathing Patterns**: Edit `data/impulses.ts` → `breathingPatterns`

## 📈 Analytics & Monitoring

### Add Analytics (Optional)

To track user behavior, add analytics to `components/ExercisePlayer.tsx`:

```typescript
const emitAnalyticsEvent = (eventName: string, payload: any) => {
  // Send to your analytics service
  // Example: Google Analytics, Mixpanel, etc.
  console.log(`[Analytics] ${eventName}:`, payload);
};
```

## 🔒 Security

- ✅ HTTPS enforced via GitHub Pages
- ✅ No sensitive data in client-side code
- ✅ No API keys exposed
- ✅ Content Security Policy headers (via GitHub Pages)

## 📞 Support

### Common Commands

```bash
# Development
npm run dev              # Start dev server

# Building
npm run build:web        # Build for web

# Testing
npx serve dist           # Test production build locally

# Deployment
git push origin main     # Deploy via GitHub Actions
gh-pages -d dist         # Manual deployment
```

### Resources

- [Expo Documentation](https://docs.expo.dev/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [React Native Web](https://necolas.github.io/react-native-web/)

## ✨ Final Checklist

Before going live:

- [ ] Build completes without errors
- [ ] All features tested locally
- [ ] DNS records configured
- [ ] Custom domain verified on GitHub
- [ ] HTTPS enabled
- [ ] All routes working
- [ ] Mobile layout tested
- [ ] Desktop layout tested
- [ ] Performance acceptable (Lighthouse)
- [ ] SEO meta tags present
- [ ] PWA manifest configured
- [ ] Service worker functioning
- [ ] Analytics configured (optional)

## 🎉 You're Ready!

Your GoFriday app is now production-ready and can be deployed to GitHub Pages at **https://gofriday.shop**.

Run `npm run build:web` and push to GitHub to deploy! 🚀

---

**Need Help?**
- Check the browser console for errors
- Review GitHub Actions logs
- Test locally with `npx serve dist`
- Verify DNS propagation with `dig gofriday.shop`
