# Copilot / AI Agent Quick Reference for this repo

Short, actionable guidance to help an AI coding agent be productive immediately.

## Big picture
- This is a client-only React + Vite TypeScript storefront (no backend). Key entry points: `index.tsx`, `App.tsx` (routes), and `ProductContext.tsx` (single source of truth for product, brand, campaign, blog data).
- Initial data/seeds live in `constants.ts` and are loaded into localStorage on first run by `ProductContext`.
- Admin UI (`pages/AdminPage.tsx`) edits data in-memory and persists to localStorage via `ProductContext` CRUD helpers.

## How to run / debug
- Install & run:
  - `npm install`
  - `npm run dev` (dev server: Vite, default port 3000, host 0.0.0.0)
- Open pages with hash routes (app uses `HashRouter`): e.g. `http://localhost:3000/#/admin` for Admin panel.
- Styling uses Tailwind via CDN in `index.html` (no Tailwind build step).

## Important files & patterns (do not assume a backend)
- `constants.ts` — canonical seed data (products, categories, brands). To add bulk sample data, edit here.
- `ProductContext.tsx` — loads seeds into localStorage, exposes CRUD: `addProduct`, `updateProduct`, `deleteProduct`, etc. LocalStorage keys used:
  - `patidukkan_products`, `patidukkan_campaigns`, `patidukkan_brands`, `patidukkan_categories`, `patidukkan_blog_posts`, `patidukkan_site_settings`, `patidukkan_home_features`, `patidukkan_home_categories`, `patidukkan_customer_reviews`
  - UI also uses `cart` and `wishlist` (in `App.tsx`) and `recentlyViewed` in product detail.
- `types.ts` — canonical TypeScript interfaces for all entities (use these when adding fields).
- `AdminPage.tsx` — canonical UI for creating/updating entities; slugs are generated with:
  - `name.toLowerCase().replace(/ /g, '-').replace(/[^
\w-]+/g, '')` (no uniqueness guarantees)
  - IDs are created as `p${Date.now()}`, `b${Date.now()}` etc.
- `process_images.py` — a local Python image processing helper (Pillow); input folders are in the repo and outputs are placed under `products/...`. Use Python + Pillow to run it.

## Environment variables
- `.env.local` contains `GEMINI_API_KEY` (placeholder). `vite.config.ts` injects it into the build as `process.env.GEMINI_API_KEY`. Currently, no code consumes it; if you add integrations, reference `process.env.GEMINI_API_KEY` and document in `README.md`.

## Conventions & gotchas
- UI text is primarily Turkish and prices are numbers in TL (use `toLocaleString('tr-TR')` for display).
- Routes use `HashRouter` (URLs include `#`) — tests or integration checks should use hash-based navigation.
- Product images are referenced from `public/` and `products/` folders; many assets have long Turkish paths. `process_images.py` exists to normalize/optimize images.
- Data is persisted client-side via localStorage. To reset state while developing, clear the relevant key(s) in the browser console, e.g. `localStorage.removeItem('patidukkan_products')` or `localStorage.clear()`.
- There are no automated tests or CI workflows in this repo (no `test` script). Add tests and CI only if necessary and document new scripts in `package.json` and `README.md`.

## Examples for common tasks
- Debug missing product: check product slug vs `products[].slug`, ensure `products` are loaded from `ProductContext`.
- Add seeded product for development: edit `PRODUCTS` in `constants.ts` and reload (or reset localStorage key `patidukkan_products`).
- Add an image: process with `process_images.py` and add `images` entries to the product object (first image used as thumbnail in lists).

---
If anything above is unclear or you want additional examples (e.g., common PR patterns, file templates, or unit test stubs), tell me which sections to expand. Thanks!