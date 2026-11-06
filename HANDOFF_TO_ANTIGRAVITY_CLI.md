# PARKit – Master Technical Handover Document for Antigravity CLI

> **Document Type**: Project Context Transfer & Migration Handover  
> **Target Tool**: Antigravity CLI  
> **Source Platform**: Antigravity IDE  
> **Project**: PARKit – Smart Parking Platform  
> **Repository Location**: `c:\Users\anush\Documents\PARKit`  
> **Date**: November 2026  
> **Status**: Ready for CLI Continuation (No Rebuilding Needed)

---

## 1. Executive Summary & Purpose of Migration

This document facilitates an immediate, zero-downtime, zero-loss transition of the **PARKit** application from the Antigravity IDE to the **Antigravity CLI**. 

The application is an AI-powered smart parking mobility platform designed for drivers to discover, navigate to, and pay for verified overhead-camera parking bays in Mysore (Mysuru), Karnataka, India. The UI and interaction design are modeled after consumer mobility platforms such as **Ola** and **Uber**—clean, uncluttered, map-centric, and devoid of hackathon widget walls.

**CRITICAL MANDATE FOR ANTIGRAVITY CLI AGENT**:
- **DO NOT rebuild this project from scratch.**
- **DO NOT replace the project with a generic template.**
- **DO NOT delete or overwrite working components or architecture.**
- **Continue incrementally from the exact state described in this handover.**

---

## 2. Product Identity & Design Requirements

| Dimension | Specification |
| :--- | :--- |
| **Application Name** | PARKit |
| **Official Tagline** | *Find it. Park it. Move on.* |
| **App Identifier** | `com.parkit.smartparking` |
| **Browser Title** | `PARKit – Smart Parking` |
| **Official Logo** | `public/images/parkit-logo.png` (Large light-blue letter P, vintage navy car illustration, PARKit wordmark). **Must be preserved unchanged with `object-contain`.** |
| **Primary Theme** | Royal Blue & Clean White (`#2563EB` Primary, `#163A70` Deep Blue, `#EFF6FF` Light Blue, `#F8FAFC` App Background, `#FFFFFF` Card Surfaces, `#172554` Primary Text, `#64748B` Muted Text) |
| **Mode** | Light mode rendered by default. No dark dashboard. |
| **Status Color Rules** | Green (`#16A34A` / `text-emerald-700 bg-emerald-50`) is reserved **strictly** for available empty parking slots. Red (`#DC2626`) for occupied, Amber (`#D97706`) for uncertain. |
| **Currency** | Indian Rupees (`INR`, `₹`) formatted via `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`. Zero USD `$` symbols anywhere in the customer UI. |
| **Navigation** | **Sidebar navigation only**. No bottom navigation bar. Slide-out hamburger drawer on mobile, compact collapsible sidebar on desktop. |
| **Role Scope** | **Exclusively driver-facing**. All Space Owner and Admin role selectors and dashboards have been completely removed from the driver client. |

---

## 3. End-to-End User Journey

The application strictly implements the following consumer flow:

```
Unauthenticated User
       │
       ▼
[1. Login Page] ──(New User)──► [Registration Page]
       │                                │
 (Auth Successful)               (Auth Successful)
       │                                │
       └────────────────►◄──────────────┘
                         │
                         ▼
        [2. Location Permission Screen]
         ├── "Use My Current Location" (GPS + Reverse Geocoding)
         └── "Enter Location Manually" (Country → State → District → Locality)
                         │
                         ▼
        [3. Driver Dashboard (/home)]
         ├── Greeting with actual driver's name
         ├── Location indicator with click-to-change modal
         ├── Topbar with Notification Bell & Avatar (opens Profile Drawer)
         ├── "Where do you want to park?" Search Card
         ├── Interactive Leaflet OpenStreetMap (User dot + Blue parking pins)
         └── "Nearby Parking" Section (Real registered hubs only)
                         │
                         ▼
        [4. Parking Details (/parking/:locationId)]
         ├── Space Breakdown (Total, Empty, Occupied, Uncertain)
         ├── Camera Telemetry Status & Freshness Timestamp
         ├── Hourly rate in INR (₹)
         ├── "Get Directions" (Google Maps)
         └── "Continue to Parking"
                         │
                         ▼
        [5. Checkout & Settlement (/checkout/:locationId)]
         ├── Vehicle Selector (Karnataka registered plate)
         ├── Duration selector (1, 2, 3, 4, 8 hours)
         ├── Indian Payment Methods (UPI, GPay, PhonePe, Paytm, Cards, NetBanking)
         └── Transparent Gateway Handling (Never fakes live debit)
                         │
                         ▼
        [6. Parking History & Invoices (/parking-history)]
         └── All / Completed / Active / Cancelled session audit
```

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework**: React 19 (`react: ^19.0.0`, `react-dom: ^19.0.0`)
- **Build Tool**: Vite 6 (`vite: ^6.2.0`, `@vitejs/plugin-react: ^4.3.4`)
- **Styling**: Tailwind CSS v4 (`tailwindcss: ^4.0.0`, `@tailwindcss/vite: ^4.0.0`)
- **Routing**: React Router v7 (`react-router-dom: ^7.2.0`)
- **Icons**: Lucide React (`lucide-react: ^1.16.0`)
- **Motion**: Framer Motion (`framer-motion: ^12.4.7`)
- **Maps**: Leaflet (`leaflet: ^1.9.4`) with standard OpenStreetMap tile layers
- **HTTP Client**: Axios (`axios: ^1.7.9`) with auth bearer interceptors and fallback normalization
- **PWA**: `vite-plugin-pwa: ^0.21.1` configured with Service Worker generation in `vite.config.js`

### 4.2 State Management Architecture
- **`AuthContext.jsx`**: Centralized authentication, driver profile, saved location, and manual sample-mode state.
- **`NotificationContext.jsx`**: Global toast notification system and real-time alert feed.
- **`ThemeContext.jsx`**: Theme manager defaulting to `'light'`.

### 4.3 Service Layer Pattern
- **`src/services/api.js`**: Central Axios client configured with base URL from `VITE_API_BASE_URL`.
- **`src/services/locationService.js`**: `getLocations()`, `getNearbyLocations(lat, lng, radius)`, `getLocationById(id)`.
- **`src/services/vehicleService.js`**: `getUserVehicles()`, `addVehicle()`, `updateVehicle()`, `deleteVehicle()`, `setDefaultVehicle()`. Persists to `localStorage` under `parkit_user_vehicles`.
- **`src/services/sessionService.js`**: `getActiveSession()`, `getUserSessions()`, `getSessionById(id)`, `recordSession()`. Persists to `localStorage` under `parkit_user_sessions`.
- **`src/services/paymentService.js`**: `getUserPayments()`, `createCheckoutSession()`, `getPaymentStatus()`, `recordPayment()`. Persists to `localStorage` under `parkit_user_payments`.

---

## 5. Sample / Demo Mode Separation (Requirement 13)

To ensure this operates as a real consumer application and not a fabricated hackathon demo:
1. **Normal Mode (Default)**:
   - Does NOT automatically inject mock vehicles, mock sessions, or fake payments.
   - Does NOT show the words `DEMO DATA` on headers, cards, or screens.
   - If the backend is offline and no parking locations are registered, it renders a clean empty state:
     > *"No registered PARKit parking spaces found nearby. Try changing your location or explore another area."*
2. **Sample Data Mode (Manual Trigger Only)**:
   - Accessible only via **Settings → Load Sample Data**.
   - Allows explicit selection of exactly **one** of the 5 demo driver profiles:
     1. **Anusha** – Maruti Suzuki Swift (`KA09MN4821`)
     2. **Vismaya** – BMW 3 Series (`KA09AB7316`)
     3. **Vaishakh** – Audi Q5 (`KA09CD9254`)
     4. **Tarun** – Toyota Fortuner (`KA09EF6183`)
     5. **Deepak** – Toyota Innova (`KA09GH3072`)
   - When loaded, a subtle chip appears in the layout: `Prototype Sample Mode: [Driver Name] [Reset Clean Mode]`.
   - Clicking "Reset Clean Mode" instantly restores the clean application state.

---

## 6. Real Backend Integration Readiness

The frontend is wired to connect to the existing FastAPI computer vision backend:
- `GET /api/locations` — Retrieve all registered parking hubs.
- `GET /api/locations/nearby?lat=&lng=&radius=` — Geofenced nearby parking search.
- `GET /api/locations/{location_id}` — Details for a specific hub.
- `GET /api/locations/{location_id}/slots` — Slot layout coordinates and statuses.
- `GET /api/locations/{location_id}/status` — Real-time camera detection timestamp & status.
- `GET /api/users/me/payments` — Verified payment transaction receipts.
- `POST /api/payments/create-checkout-session` — Backend order creation for Razorpay / UPI gateway.
- `GET /api/system/health` — System status.
- `WebSocket /ws/parking/{location_id}` — Push updates for bay occupancy transitions.

---

## 7. Immediate Tasks for Antigravity CLI

When you take over in Antigravity CLI:
1. Run `npm.cmd run dev` or `npm.cmd run build` to verify local bundle status.
2. Review [`DEVELOPMENT_STATUS.md`](file:///c:/Users/anush/Documents/PARKit/DEVELOPMENT_STATUS.md) for individual component readiness.
3. Keep the authentic Ola/Uber design aesthetic consistent across any new enhancements.

