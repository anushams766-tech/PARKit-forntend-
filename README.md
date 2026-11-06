# PARKit – Smart Parking Application (Driver Frontend)

> **"Find it. Park it. Move on."**  
> AI-powered smart parking web and progressive web application (PWA) connecting overhead computer-vision parking cameras with drivers searching for real-time verified parking in Mysuru, Karnataka.

---

## 🎨 Brand Design & Identity

- **Official Logo**: Preserved PARKit logo (`public/images/parkit-logo.png`) featuring the vintage navy car inside the light-blue letter `P` with official wordmark.
- **Royal Blue & White Theme**:
  - Primary Blue: `#2563EB`
  - Deep Navy Blue: `#163A70`
  - Light Blue Surfaces: `#EFF6FF`
  - Main Background: `#F8FAFC`
  - Card Surfaces: `#FFFFFF`
  - High-Contrast Dark Mode: `#0B1528` background, `#13223B` cards, `#1E3A63` borders
- **Parking Slot Status Colors**:
  - `EMPTY` (`#16A34A` / Green): Confirmed vacant space ready for immediate parking.
  - `OCCUPIED` (`#DC2626` / Red): Space currently filled by another vehicle.
  - `UNCERTAIN` (`#D97706` / Amber): Vision view obstructed or calibrating. **Strictly NOT counted as available.**

---

## 🚀 Key Modules & Architecture

### 1. Driver Authentication & Onboarding
- **Login (`/login`)**: Email/Password authentication + Google Identity Services (GIS) ID Token flow.
- **Registration (`/register`)**: Full Name, Mobile, Email, Password, and cascading location picker.
- **Cascading Location Selection (`/location-permission`)**: Multi-country support, all 28 Indian States & 8 UTs, Karnataka districts, and 21 Mysuru localities with searchable autocomplete typing.
- **Driver Profile Setup (`/onboarding/profile`)**: Captures verified driver name and mobile number.
- **Vehicle-First Onboarding (`/onboarding/vehicle`)**: First step after profile. Captures plate (e.g. `KA09MN4821`), brand, model, vehicle category, and colour.

### 2. Parking Discovery & Live Map
- **Driver Dashboard (`/home`)**:
  - Personalized driver greeting and operating locality chip.
  - Search destination card with GPS coordinate detection.
  - **Live Parking Map**: Container-isolated Leaflet OpenStreetMap centered on Mysore (`12.3051° N, 76.6551° E`) with `isolation: isolate` and zero spillover over topbar/sidebar/profile drawers.
  - Nearby registered parking hub cards with real-time vacant spot counts, distance, and pricing.
- **Explore Parking (`/explore`)**:
  - Destination search with smart locality matching (Vijayanagar, Kuvempunagar, Gokulam, Jayalakshmipuram, Hebbal, etc.).
  - Toggle between interactive Card Grid and Map View.
  - Friendly empty states suggesting operating hubs when query yields 0 results.

### 3. Session Details & Checkout
- **Hub Details (`/parking/:locationId`)**:
  - Computer-vision camera telemetry (status, confidence score, resolution, last detection time).
  - Stale data warning indicator (>90s).
  - Interactive slot grid with visual occupancy states.
  - Google Maps turn-by-turn directions link.
- **Checkout (`/checkout/:locationId`)**:
  - Vehicle selector, duration selector (1h to 8h), and fare breakdown in Indian Rupees (₹).
  - Supported Indian payment methods (UPI, GPay, PhonePe, Paytm, Cards, Net Banking).
  - **Stripe Checkout (TEST MODE)**: Interactive test modal supporting passing card (`4242...`), declining card (`4000...0002`), and Stripe UPI (`success@stripe`).
- **Payment Verification Result (`/payment-result`)**:
  - Cryptographic / backend verification check before rendering success voucher or failure receipt.

### 4. Vehicle & Session Management
- **My Vehicles (`/vehicles`)**: Full CRUD support for driver vehicles, plate regex validation, and default primary vehicle designation.
- **Parking History (`/parking-history`)**: Card view and tabular audit view of past sessions, filterable by `ALL`, `COMPLETED`, `ACTIVE`, `CANCELLED` with INR receipts.
- **Payments (`/payments`)**: Saved payment methods and verified invoice history.

### 5. Settings & Demo Experience
- **Appearance Settings**: Immediate live preview between Light Mode, Dark/Night Mode, and System Default with explicit Apply & Save / Cancel buttons.
- **Notification Settings**: Granular toggles for parking updates, camera alerts, payment receipts, and stale-data warnings.
- **5-Profile Mysore Demonstration System**:
  - Prominent `DemoDataBar` accessible on 5 core views + Settings.
  - 5 selectable Mysore profiles: Anusha (Swift), Vismaya (BMW), Vaishakh (Audi), Tarun (Fortuner), Deepak (Innova).
  - Synchronizes vehicles, Mysore hubs, sessions, and payments labeled with `DEMO` badges.
  - One-click `Reset Demo Data` instantly wipes sample records.

---

## 🛠 Tech Stack

- **Framework**: React 19 + Vite 6
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + Design Tokens (`variables.css`, `components.css`)
- **Map Engine**: Leaflet 1.9 + OpenStreetMap (CSS fully bundled locally)
- **Icons**: Lucide React
- **API Client**: Axios (configured with base URL and JWT bearer interceptor)
- **Resilience**: Root React `ErrorBoundary` preventing blank screens
- **PWA**: `vite-plugin-pwa` with offline caching service worker

---

## 🔌 FastAPI Backend Integration Contract

Configured in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=
VITE_GOOGLE_MAPS_API_KEY=
VITE_DEMO_MODE=true
```

### Endpoints Connected by Driver Frontend:
- `POST /api/auth/google` — Verifies Google GIS signed JWT ID Token and returns `{ token, user, is_new_user }`.
- `GET /api/locations` — Retrieve all registered parking hubs.
- `GET /api/locations/nearby?lat=&lng=&radius=` — Geofenced nearby parking search.
- `GET /api/locations/{id}` — Parking hub details and hourly tariff.
- `GET /api/locations/{id}/slots` — Slot layout coordinates and statuses.
- `GET /api/locations/{id}/status` — Camera connection telemetry and confidence score.
- `POST /api/payments/create-checkout-session` — Generates payment session order for Stripe / UPI in INR.
- `GET /api/payments/verify-session/{id}` — Cryptographically verifies payment transaction status before completion.
- `GET /api/users/me/payments` — Verified payment receipts.

---

## 💻 Setup & Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
copy .env.example .env
```
Add your `VITE_GOOGLE_CLIENT_ID` if testing Google Sign-In.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 4. Build for Production
```bash
npm run build
```
Verify the production build locally:
```bash
npm run preview
```

---

## 👥 Team Collaboration Notes

- **Driver Frontend**: Contained in this repository (`src/`).
- **Owner Frontend**: Maintained by the owner frontend teammate and can be integrated into `src/pages/owner/` and `src/components/owner/`.
- **Backend**: FastAPI computer-vision backend hosted on port `8000` (`http://localhost:8000`).
