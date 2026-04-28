# Honey's Fresh N Frozen - B2C Digital Card

**Complete standalone B2C implementation for separate deployment**

**Year: 2025**

---

## 📁 Folder Structure

```
Honey-Fresh-N-Frozen-B2C/
├── app/
│   ├── shops/
│   │   └── honeys-fresh-n-frozen/
│   │       ├── components/        # 11 B2C components
│   │       ├── config.ts         # B2C configuration
│   │       └── menu.ts            # Menu data
│   ├── components/                # Shared components
│   ├── api/                       # API routes
│   ├── lib/                       # Utilities
│   ├── contexts/                  # React contexts
│   ├── data/                      # Site config
│   ├── menu/                      # Menu page
│   ├── gallery/                   # Gallery page
│   ├── reviews/                   # Reviews page
│   ├── page.tsx                   # Root home page
│   ├── layout.tsx                 # App layout
│   └── globals.css                # Global styles
├── components/
│   └── ui/                        # UI components
└── public/
    ├── shops/honeys-fresh-n-frozen/assets/  # B2C assets
    ├── logos/                     # Payment logos
    └── gallery/                   # Shared images
```

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Add environment variables:**
   Create `.env.local`:
   ```env
   GOOGLE_PLACES_API_KEY=your_api_key_here
   ```

3. **Run development:**
   ```bash
   pnpm dev
   ```

4. **Build for production:**
   ```bash
   pnpm build
   ```

## 📍 Routes

- **Home:** `/`
- **Menu:** `/menu`
- **Reviews:** `/reviews`
- **Gallery:** `/gallery`

## ✅ Features

- Single location (Jammu)
- Full menu with categories (Fish, Chicken, Mutton, Prawns, Veg)
- Google Reviews integration
- Gallery with lightbox
- Payment system (UPI + Bank Transfer)
- WhatsApp integration (Honey & Money)
- Contact card with embedded map
- Social media integration

## 📝 Status

✅ **COMPLETE** - All B2C files, assets, and dependencies included. Ready for separate deployment.

Latest update: order flow UI and filter UX refinements are included in the main app.

---

*Year: 2025*
