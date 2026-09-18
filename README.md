# Sri Jeyam Crackers (ஸ்ரீ ஜெயம் பட்டாசு) 🎆🪔

Online Direct Selling & Admin Management Platform for **Sri Jeyam Crackers, Sivakasi**.

## Features

- **Diwali 2026 Price List:** Preloaded with 214 authentic cracker items across 19 categories directly from the Sivakasi factory price list.
- **Flat 75% Festive Discount:** Automatic calculation of Actual MRP, 75% Discount, and Net Payable Rate.
- **Guest Storefront (No Login Required):** Quick shopping cart, item quantity stepper, address entry, and direct WhatsApp checkout.
- **Big Picture Quick View:** Click any cracker product or picture to inspect in full-screen with interactive 150% zoom.
- **Admin Portal (`/admin`):**
  - Completely hidden from public storefront (accessible strictly via `/admin` URL).
  - Modify Actual Rate (MRP), Discount %, Net Rate, and Stock status in real-time.
  - Category Batch Discount Tool (update discounts across entire categories in one click).
  - Add / Upload product pictures directly from computer or mobile phone.
  - Official Bill / Tax Invoice Generator: Printable standard A4 invoice format (`window.print()`) and direct WhatsApp receipt sender.
  - Counter / Walk-in POS Billing (quick bill generation for physical store customers).
  - Default Admin Credentials: `admin` / `srijeyam@admin2026`.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, JWT, Bcrypt
- **Database:** Supabase (PostgreSQL) with resilient local JSON fallback
- **Deployment:** Vercel

---

## Local Development

1. **Install Dependencies:**
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```

2. **Start Backend Server:**
   ```bash
   cd server
   node server.js
   # Runs on http://localhost:5000
   ```

3. **Start Frontend Dev Server:**
   ```bash
   cd client
   npm run dev
   # Runs on http://localhost:5173
   ```

4. **Accessing:**
   - Storefront: `http://localhost:5173/`
   - Admin Portal: `http://localhost:5173/admin`

---

## Deploying to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Sri Jeyam Crackers full release"
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com/) and click **"Add New Project"**.
   - Select your repository: `Gopinathpitchai/sri_jeyam_crackers`.
   - Vercel will automatically detect `vercel.json`.
   - Under **Environment Variables**, add:
     - `SUPABASE_URL`: `https://quigqqhspdlqgojtqyuc.supabase.co`
     - `SUPABASE_SECRET_KEY`: *(Your Supabase secret key from server/.env)*
     - `JWT_SECRET`: `sri_jeyam_crackers_secret_key_2026_diwali`
   - Click **Deploy**!
