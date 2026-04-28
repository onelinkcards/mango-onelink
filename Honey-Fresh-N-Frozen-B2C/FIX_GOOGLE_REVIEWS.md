# 🔧 Fix Google Reviews - Add API Key to Vercel

## ❌ **Problem**

You're seeing: **"Google Places API key not configured"** when the site is live.

This happens because the `GOOGLE_PLACES_API_KEY` environment variable is not set in Vercel.

---

## ✅ **Solution: Add API Key to Vercel**

### **Step 1: Get Google Places API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **"Places API"**:
   - Go to **APIs & Services** → **Library**
   - Search for **"Places API"**
   - Click **"Enable"**
4. Create API Key:
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"API Key"**
   - Copy the API key
5. **Restrict API Key** (Important for security):
   - Click on the API key you just created
   - Under **"API restrictions"**, select **"Restrict key"**
   - Choose **"Places API"**
   - Click **"Save"**

### **Step 2: Add to Vercel**

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in and go to your project

2. **Open Project Settings:**
   - Click on your project: `honey-fresh-n-frozen-b2c`
   - Go to **Settings** tab
   - Click **"Environment Variables"** in the left sidebar

3. **Add Environment Variable:**
   - Click **"Add New"**
   - **Key**: `GOOGLE_PLACES_API_KEY`
   - **Value**: Paste your Google Places API key
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**
   - Or push a new commit to trigger automatic redeploy

---

## 🔄 **Automatic Redeploy**

After adding the environment variable, Vercel will automatically:
- Use the new API key in the next deployment
- All new deployments will have access to the API key

**OR** manually redeploy:
1. Go to **Deployments** tab
2. Click **"Redeploy"** on the latest deployment

---

## ✅ **Verify It's Working**

After redeploying:

1. Visit your live site
2. Scroll to **"Google Reviews"** section
3. You should see:
   - ✅ Reviews loading
   - ✅ Star ratings
   - ✅ Review cards
   - ✅ No error message

---

## 📋 **B2C Place ID**

**Place ID is already configured:**
- Place ID: `ChIJa7Yhg4-EHjkRrZWiBBo2YRo` (Jammu location)

Located in: `app/shops/honeys-fresh-n-frozen/config.ts`

---

## 🔐 **Security Notes**

1. **Never commit API key to GitHub:**
   - ✅ Already in `.gitignore`
   - ✅ Only add in Vercel dashboard

2. **Restrict API Key:**
   - Only allow "Places API"
   - Add HTTP referrer restrictions if needed
   - Set usage quotas to prevent abuse

3. **Monitor Usage:**
   - Check Google Cloud Console for API usage
   - Set up billing alerts

---

## 📝 **Quick Checklist**

- [ ] Get Google Places API key from Google Cloud Console
- [ ] Enable Places API in Google Cloud Console
- [ ] Restrict API key to Places API only
- [ ] Add `GOOGLE_PLACES_API_KEY` to Vercel Environment Variables
- [ ] Redeploy the project
- [ ] Verify reviews are loading on live site

---

## 💡 **Reuse B2B API Key**

**You can use the same API key for both B2C and B2B projects!**

Just add the same `GOOGLE_PLACES_API_KEY` to both Vercel projects.

---

## 🐛 **Troubleshooting**

### **Still seeing error after adding key:**

1. **Check API key is correct:**
   - Copy from Google Cloud Console again
   - Make sure no extra spaces

2. **Verify environment:**
   - In Vercel, make sure key is added to **Production** environment
   - Check all environments (Production, Preview, Development)

3. **Check API is enabled:**
   - Go to Google Cloud Console
   - Verify "Places API" is enabled

4. **Check API key restrictions:**
   - Make sure "Places API" is allowed
   - Remove HTTP referrer restrictions if blocking

5. **Redeploy:**
   - Make sure you redeployed after adding the key
   - Check deployment logs for errors

---

## 📚 **Additional Resources**

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Vercel Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Status**: After adding the API key and redeploying, Google Reviews will work! ✅







