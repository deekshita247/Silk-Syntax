# Silk-Syntax — Fix-It Forward Shop

> A complete transformation of a broken e-commerce prototype into a fully functional, production-ready online store.

---

## Overview

This project was built as part of the **Fix-It Forward** hackathon challenge. The original repository contained just three files — a blank HTML shell and a CSS file. The product grid was empty, nothing was functional, and there was no backend.

Starting from that broken prototype, this submission transforms it into a polished, fully working fashion and lifestyle e-commerce store called **Silk-Syntax**.

---

## Live Demo

**VIDEO LINK**
https://drive.google.com/file/d/1V0qNzjbleF_eteRvNEY9prE0Xmsrl_2w/view?usp=sharing

**Deployment:** [https://bejewelled-mandazi-6e89c8.netlify.app/](https://bejewelled-mandazi-6e89c8.netlify.app/)

**GitHub Repository:** [https://github.com/deekshita247/Silk-Syntax](https://github.com/deekshita247/Silk-Syntax)


---

## What Was Broken (Before)

- Empty product grid — no products rendered at all
- No JavaScript file (`app.js` was missing entirely)
- No cart functionality
- No navigation — links went nowhere
- No backend or data layer
- Footer showed hardcoded year `2023`
- Mobile navigation toggle did nothing
- Checkout button was permanently disabled
- No search, sort, or filter functionality
- Hero section read *"Shipping might or might not work"*

---

## What Was Built (After)

### Core Fixes
- Created `products.js` as a structured mock data layer with 65 products across 8 categories
- Built `app.js` and later `header.js` to power all frontend logic
- Fixed the product grid — all products now render correctly with images, prices, stock levels and ratings
- Fixed the footer year to update dynamically
- Fixed the mobile navigation toggle
- Fixed the checkout button — now only enables when cart has items
- Fixed search, sort, and filter — all work simultaneously

### New Pages Built
| Page | Description |
|---|---|
| `product.html` | Full product detail page with size selector, quantity, ratings, reviews, and recommendations |
| `category.html` | Dedicated page per category with filter sidebar |
| `deals.html` | Deal of the Day page with live countdown timer |
| `wishlist.html` | Saved products page |
| `checkout.html` | Simplified checkout with form validation |
| `order-confirmation.html` | Full order confirmed page with order ID and receipt |
| `all-categories.html` | Browse all 8 categories |

### Features Added
- **65 products** across 8 categories — Electronics, Kitchen, Make Up, Women's, Men's, Kids, Accessories, Fitness
- **Dark / Light mode** toggle with smooth transitions
- **Region selector** — UAE (AED), US ($), UK (£), India (₹) with live price conversion
- **User authentication** — register and login with email and password (localStorage)
- **Cart persistence** — cart saved to localStorage, survives page refresh
- **Free shipping progress bar** inside cart panel
- **Promo code** — `SILK-SYNTAX` applies 10% discount
- **Product ratings** — pre-set star ratings on all products
- **User reviews** — logged-in users can submit reviews, stored in localStorage
- **Size selector** — S/M/L/XL for clothing, age sizes for kids
- **Wishlist** — heart-save products, view on dedicated wishlist page
- **Recently viewed** bar on product and category pages
- **Deal of the Day** — auto-picks 8 highest-discount products, countdown to midnight
- **Filter sidebar** — filter by price range, size, and star rating
- **Micro-animations** — card hover lift, cart item slide-in, button transitions
- **Cookie consent** banner
- **Trust badges** strip
- **Announcement bar** with dismissal
- **Responsive mobile design** — hamburger menu, adaptive grid, full-width cart

### Brand & Design
- Custom luxury brand palette — Silk `#F7F4EF`, Marble `#F0EDE6`, Champagne `#C9A96E`, Velvet `#1E2845`
- Script logo font using Google Fonts (Great Vibes)
- Display font: Cormorant Garamond
- Body font: Jost
- Category split: Clothes → Women's, Men's, Kids (3 separate pages)
- Custom banner images on homepage

---

## Project Structure

```
Silk-Syntax/
├── index.html              # Homepage — promo banners, hero, countdown
├── category.html           # Category page — products, filters, sort, search
├── product.html            # Product detail — image, sizes, add to bag, reviews
├── deals.html              # Deal of the Day — countdown timer, discounted products
├── wishlist.html           # Saved products
├── checkout.html           # Checkout form — contact, shipping, payment
├── order-confirmation.html # Order confirmed — receipt, order ID, delivery estimate
├── all-categories.html     # Browse all 8 categories
├── products.js             # Mock data layer — 65 products with full metadata
├── header.js               # Shared logic — cart, auth, region, dark mode, footer
├── styles.css              # Global styles — brand palette, dark mode, responsive
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML, CSS, JavaScript (no framework) |
| Data layer | `products.js` — structured JS array acting as mock backend |
| Persistence | `localStorage` — cart, wishlist, user accounts, orders, reviews |
| Fonts | Google Fonts — Great Vibes, Cormorant Garamond, Jost |
| Images | ImgBB / Unsplash |
| Deployment | Netlify |

---

## Mock Backend Approach

Since the challenge specified no backend was included and encouraged adding one, the data layer is handled through a structured `products.js` file that acts as a mock API — all product retrieval, filtering, sorting, and category logic runs against this file. All state (cart, user session, wishlist, orders, reviews) is persisted in `localStorage`, making the experience fully functional without a server.

This architecture means the store could be connected to a real REST API or database (e.g. Node/Express + MongoDB) by simply replacing the `products` array with `fetch()` calls — all the frontend logic is already structured to support that upgrade.

---

## Key Technical Decisions

**Shared `header.js` component** — Rather than duplicating header, cart, auth, and footer HTML across every page, all shared logic is centralised in `header.js` and injected at runtime using `injectHeader()` and `injectFooter()`. This keeps all pages consistent and makes global changes (e.g. adding a new nav link) a single-file edit.

**Scripts in `<head>` not `<body>`** — After debugging script loading order issues, all external scripts (`products.js`, `header.js`) are loaded in `<head>` so they are fully available when inline scripts run immediately on page load.

**Category pages via URL params** — A single `category.html` file handles all 8 categories by reading `?cat=Electronics` from the URL. This avoids duplicating page code while giving each category its own shareable URL.

**No framework chosen deliberately** — The challenge stated the original codebase was plain HTML/CSS/JS. Keeping the same stack respects the original foundation while demonstrating strong vanilla JS skills.

---

## How to Run Locally

**Option 1 — Open directly**
1. Clone or download the repository
2. Open `index.html` in your browser

**Option 2 — Live Server (recommended)**
1. Open the folder in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**
4. Visit `http://127.0.0.1:5500`

No build step, no dependencies, no install required.

---

## Setup Notes

- All data is in `products.js` — edit product names, prices, images, or stock levels there
- To add a promo banner image, open `index.html` and replace the `src` on the relevant `<img class="banner-bg">` tag
- Promo code is `SILK-SYNTAX` — defined in `header.js` in the `applyPromo()` function
- To change the region default, edit the `currentRegion` line in `header.js`
- Dark mode preference is saved to `localStorage` key `fif_theme`

---

## Suggested Next Steps (Real Backend)

To upgrade from mock to production:
1. Replace `products.js` with a Node.js/Express API endpoint returning JSON
2. Replace `localStorage` cart with server-side sessions or a database
3. Add real payment processing via Stripe
4. Add email confirmation via SendGrid or Resend
5. Deploy API on Railway or Render alongside the Netlify frontend

---
## Author

**Deekshita** — Built for the Fix-It Forward hackathon challenge
Forked from [acmw-bpdc/Fix-it-Forward](https://github.com/acmw-bpdc/Fix-it-Forward)

---

*This is a demo store. No real payments are processed and no orders will ship.*