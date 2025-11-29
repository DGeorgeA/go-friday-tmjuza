
# GoFriday Web Build for GitHub Pages

## Overview
This document provides instructions for building and deploying the GoFriday app to GitHub Pages at https://gofriday.shop.

## Build Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build for Production
```bash
npm run build:web
```

This command will:
- Generate a fully optimized static web build
- Minify JavaScript and CSS
- Bundle all assets with relative paths
- Create the `dist/` folder with all required files

### 3. Output Structure
After building, the `dist/` folder will contain:

```
dist/
├── index.html              # Main HTML entry point
├── manifest.json           # PWA manifest
├── favicon.ico             # Favicon
├── _redirects              # Routing configuration for GitHub Pages
├── CNAME                   # Custom domain configuration
├── _expo/
│   └── static/
│       ├── js/             # Minified JavaScript bundles
│       └── css/            # Minified CSS files
└── assets/
    ├── images/             # All image assets
    ├── exercises/          # Exercise photos and blossoms
    └── fonts/              # Font files
```

## Deployment Options

### Option 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and deploys on every push to the `main` branch.

**Setup:**
1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set Source to "GitHub Actions"
4. The workflow will automatically build and deploy

### Option 2: Manual Deployment

1. Build the project:
   ```bash
   npm run build:web
   ```

2. Deploy the `dist/` folder to GitHub Pages:
   ```bash
   # Install gh-pages if not already installed
   npm install -g gh-pages
   
   # Deploy
   gh-pages -d dist
   ```

3. Configure custom domain:
   - Go to repository Settings → Pages
   - Set custom domain to `gofriday.shop`
   - Ensure DNS is configured correctly

## DNS Configuration

For the custom domain `gofriday.shop` to work, configure these DNS records:

```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     <your-username>.github.io
```

## Features Included in Web Build

✅ All backgrounds and pink blossom animations
✅ B&W motivational photos
✅ Slowdown/fast-forward controls
✅ Monkhood badges and progress tracking
✅ All styling and Japanese minimalism design
✅ Mobile and desktop responsive layouts
✅ HTTPS support via GitHub Pages
✅ All navigation flows and routing
✅ Fast loading with minified assets
✅ Service worker for offline support (via workbox)

## Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Asset Optimization**: Images optimized and lazy-loaded
- **Minification**: All JS/CSS minified for production
- **Caching**: Service worker caches assets for offline use
- **Tree Shaking**: Unused code removed from bundles

## Routing Configuration

The `_redirects` file ensures that all routes work correctly on GitHub Pages by redirecting all requests to `index.html`, allowing client-side routing to handle navigation.

## Testing Locally

Before deploying, test the production build locally:

```bash
# Build
npm run build:web

# Serve locally (install serve if needed)
npx serve dist

# Open http://localhost:3000
```

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify all asset paths are relative
- Ensure `_redirects` file is in the `dist/` folder

### Custom Domain Not Working
- Verify DNS records are correct
- Wait up to 24 hours for DNS propagation
- Check that CNAME file contains `gofriday.shop`

### Assets Not Loading
- Verify assets are in the `dist/assets/` folder
- Check that paths in code use relative references
- Clear browser cache and hard reload

## Build Output Confirmation

After running `npm run build:web`, you should see:

```
✓ Compiled successfully
✓ Exported static files to: dist/
✓ Build size: ~2-5 MB (optimized)
✓ All assets bundled with relative paths
✓ Ready for GitHub Pages deployment
```

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all build steps completed successfully
3. Test locally before deploying
4. Review GitHub Pages deployment logs

## Production Checklist

Before deploying to production:

- [ ] All features tested in development
- [ ] Build completes without errors
- [ ] Local production build tested
- [ ] DNS configured correctly
- [ ] HTTPS enabled on GitHub Pages
- [ ] Custom domain verified
- [ ] All routes working correctly
- [ ] Mobile and desktop layouts tested
- [ ] Performance metrics acceptable
- [ ] Service worker functioning

## Continuous Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:
1. Checks out the code
2. Installs dependencies
3. Builds the web version
4. Deploys to GitHub Pages
5. Updates the custom domain

Every push to `main` triggers a new deployment.

---

**Ready to Deploy!** 🚀

Your GoFriday app is now configured for production deployment to GitHub Pages at https://gofriday.shop.
