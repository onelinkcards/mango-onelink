# 🚀 Vercel Deployment Guide - B2C OneLink Card

## ✅ **Status: Ready to Deploy!**

B2C project has been pushed to GitHub and is ready for Vercel deployment.

**GitHub Repository**: https://github.com/onelinkcards/Honey-Fresh-N-Frozen-B2C.git

---

## 🌐 **Deploy to Vercel - Step by Step**

### **Step 1: Go to Vercel Dashboard**

1. Visit [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**

### **Step 2: Import GitHub Repository**

1. Click **"Import Git Repository"**
2. Search for: `Honey-Fresh-N-Frozen-B2C`
3. Or paste: `onelinkcards/Honey-Fresh-N-Frozen-B2C`
4. Click **"Import"**

### **Step 3: Configure Project Settings**

**IMPORTANT**: Vercel will auto-detect most settings, but verify:

- **Project Name**: `honey-fresh-n-frozen-b2c` (or your preferred name)
- **Framework Preset**: `Next.js` ✅ (auto-detected)
- **Root Directory**: `./` ✅ (leave as default - this is the root)
- **Build Command**: `pnpm build` ✅ (auto-detected from vercel.json)
- **Output Directory**: `.next` ✅ (auto-detected from vercel.json)
- **Install Command**: `pnpm install` ✅ (auto-detected from vercel.json)

### **Step 4: Environment Variables**

**Add Google Places API Key:**

1. Go to **Environment Variables** section
2. Click **"Add New"**
3. **Key**: `GOOGLE_PLACES_API_KEY`
4. **Value**: Your Google Places API key (same as B2B or create new one)
5. **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**

**Note**: See `FIX_GOOGLE_REVIEWS.md` for detailed API key setup instructions.

### **Step 5: Deploy!**

1. Click **"Deploy"** button
2. Wait for build to complete (2-3 minutes)
3. You'll get a live URL like: `https://honey-fresh-n-frozen-b2c.vercel.app`

---

## ⚙️ **Automatic CI/CD - Already Enabled!**

✅ **Every push to GitHub automatically deploys to Vercel!**

### **How It Works:**

1. **Make changes locally:**
   ```bash
   git add .
   git commit -m "Update features"
   git push origin main
   ```

2. **Vercel automatically:**
   - Detects the push
   - Runs `pnpm install`
   - Runs `pnpm build`
   - Deploys to production
   - Updates live URL

3. **You get:**
   - ✅ Production deployment URL
   - ✅ Build logs in Vercel dashboard
   - ✅ Deployment notifications
   - ✅ Preview URLs for pull requests

---

## 🔍 **Post-Deployment Verification**

### **Check Build Status:**

1. Go to Vercel Dashboard
2. Click on your project
3. Check **"Deployments"** tab
4. Verify:
   - ✅ Build succeeded (green checkmark)
   - ✅ No build errors
   - ✅ Deployment successful

### **Test Live URL:**

Visit your deployment URL and test:
- [ ] ✅ Home page loads
- [ ] ✅ Card flip animation works
- [ ] ✅ All buttons functional
- [ ] ✅ Gallery lightbox works
- [ ] ✅ Payment modal opens
- [ ] ✅ Images load correctly
- [ ] ✅ Mobile responsive
- [ ] ✅ Google Reviews load (after adding API key)
- [ ] ✅ No console errors

---

## 📊 **Build Configuration**

**vercel.json** (already configured):
```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

---

## 🎯 **Build Output**

Expected build output:
```
✓ Compiled successfully
✓ Generating static pages (7/7)
Route (app)                              Size     First Load JS
┌ ○ /                                    33.4 kB         170 kB
├ ○ /gallery                             3.8 kB          140 kB
├ ○ /menu                                5.3 kB          141 kB
└ ○ /reviews                             4.98 kB         141 kB
```

---

## 🐛 **Troubleshooting**

### **Build Fails:**

1. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on failed deployment
   - Check error messages

2. **Common Fixes:**
   ```bash
   # Test build locally
   cd "/Users/krishang/Downloads/Repixelx Studio/onelink - card/Main design- 01/Onelink-honey money/Honey-Fresh-N-Frozen-B2C"
   rm -rf .next node_modules
   pnpm install
   pnpm build
   ```

### **Images Not Loading:**

- Check image paths in `public/` folder
- Verify image extensions match code
- Ensure images are committed to git

### **TypeScript Errors:**

```bash
pnpm lint
# Fix all errors before pushing
```

---

## 📝 **Custom Domain (Optional)**

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Example: `b2c.yourdomain.com`

---

## ✅ **Pre-Deployment Checklist**

- [x] ✅ Code pushed to GitHub
- [x] ✅ Build succeeds locally (`pnpm build`)
- [x] ✅ No TypeScript errors
- [x] ✅ No linting errors
- [x] ✅ `vercel.json` configured
- [x] ✅ All images in `public/` folder
- [x] ✅ `.gitignore` configured
- [ ] ⚠️ Add `GOOGLE_PLACES_API_KEY` in Vercel (for Google Reviews)

---

## 🎉 **Ready to Deploy!**

**Status**: ✅ **PRODUCTION READY**

- ✅ Pushed to GitHub
- ✅ Build tested successfully
- ✅ Vercel config ready
- ✅ CI/CD enabled

**Next Step**: Import to Vercel, add API key, and deploy!

---

**GitHub Repo**: https://github.com/onelinkcards/Honey-Fresh-N-Frozen-B2C.git
**Status**: ✅ Ready for Vercel deployment







