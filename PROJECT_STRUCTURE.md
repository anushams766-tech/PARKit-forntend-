# PARKit – Complete Project Structure Reference

> **Project**: PARKit – Smart Parking Platform  
> **Root Directory**: `c:\Users\anush\Documents\PARKit`  
> **Environment**: React 19 + Vite 6 + Tailwind CSS v4 + React Router v7  
> **Last Updated**: November 2026

---

## 1. Directory Tree Overview

```
c:\Users\anush\Documents\PARKit
├── .env                              # Active environment variables (API URL, Demo mode)
├── .env.example                      # Template environment variables
├── .gitignore                        # Git exclusion rules (node_modules, dist, .env)
├── CLI_START_HERE.md                 # CLI startup guide & instructions
├── DEVELOPMENT_STATUS.md             # Feature-by-feature implementation classification
├── HANDOFF_TO_ANTIGRAVITY_CLI.md     # Master context transfer & architecture document
├── index.html                        # Application HTML entry point & favicon/meta tags
├── package.json                      # NPM dependencies and run scripts
├── package-lock.json                 # Dependency lockfile
├── PROJECT_STRUCTURE.md              # Complete folder and file documentation (this file)
├── README.md                         # Project overview and high-level description
├── vite.config.js                    # Vite bundler, Tailwind v4 plugin, PWA config
├── public/
│   ├── manifest.webmanifest          # PWA manifest (name, colors, icons)
│   ├── icons/                        # PWA app icons (192x192, 512x512, maskable)
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── maskable-icon.png
│   └── images/
│       └── parkit-logo.png           # Official unmodified PARKit logo (vintage car inside 'P')
└── src/
    ├── App.jsx                       # Root React provider tree (Auth, Theme, Notification, Router)
    ├── index.css                     # Tailwind CSS v4 imports & theme token definitions
    ├── main.jsx                      # React DOM mounting entry point
    ├── components/                   # UI components divided by domain
    │   ├── common/                   # Reusable atomic UI controls
    │   │   ├── Button.jsx            # Variants: primary (Royal Blue), secondary, outline, ghost
    │   │   ├── CascadingLocationPicker.jsx # Multi-country & All-India States/UTs cascading searchable autocomplete selector with Confirm Location button
    │   │   ├── ConfirmDialog.jsx     # Modal confirmation dialog for destructive actions
    │   │   ├── DemoDataBar.jsx       # Global top bar for 5 key views: Load Demo Data, Switch Profile, Reset Demo Data
    │   │   ├── DemoProfileSelectorModal.jsx # Modal displaying 5 selectable driver profiles (Anusha, Vismaya, Vaishakh, Tarun, Deepak)
    │   │   ├── EmptyState.jsx        # Honest, friendly empty state with action button
    │   │   ├── ErrorBoundary.jsx     # Root React Error Boundary preventing white screens and providing reload/reset actions
    │   │   ├── ErrorState.jsx        # Component error display with retry callback
    │   │   ├── Input.jsx             # Text, email, password input with error label & icons
    │   │   ├── Loader.jsx            # Loading spinners and status indicators
    │   │   ├── Modal.jsx             # Accessible backdrop modal with keyboard Esc trap
    │   │   ├── NotificationBell.jsx  # Notification counter badge and alert dropdown
    │   │   ├── SearchBar.jsx         # Search input with clear button and debounced queries
    │   │   ├── Select.jsx            # Custom styled dropdown select element
    │   │   ├── Skeleton.jsx          # Pulse skeleton loader for map, cards, and tables
    │   │   ├── StatusBadge.jsx       # Available (Green), Occupied (Red), Uncertain (Amber)
    │   │   └── ThemeToggle.jsx       # Light/Dark mode switcher
    │   ├── dashboard/                # Driver dashboard specific widgets
    │   │   ├── QuickActions.jsx      # Navigation shortcuts (Find Parking, Add Vehicle, History)
    │   │   ├── RecentActivity.jsx    # Real-time parking session timeline
    │   │   ├── StatisticsCards.jsx   # Clean usage stats (Total Sessions, Active, Saved Time)
    │   │   └── WelcomeHeader.jsx     # Driver personalized greeting & current location chip
    │   ├── history/                  # Parking history presentation
    │   │   ├── HistoryFilters.jsx    # Status filter tabs (All, Completed, Active, Cancelled)
    │   │   ├── ParkingHistoryCard.jsx # Mobile card view for parking receipts and sessions
    │   │   └── ParkingHistoryTable.jsx # Desktop tabular audit view with INR formatting
    │   ├── layout/                   # Core application layout and navigation
    │   │   ├── AppLayout.jsx         # Driver layout: Topbar + collapsible Sidebar + Main view
    │   │   ├── ProtectedRoute.jsx    # Auth guard redirecting unauthenticated drivers to /login
    │   │   ├── Sidebar.jsx           # 8-item navigation (mobile slide-out drawer + desktop sidebar)
    │   │   └── Topbar.jsx            # Brand header, location chip modal, alerts, avatar trigger
    │   ├── parking/                  # Parking bay & discovery components
    │   │   ├── AvailabilitySummary.jsx # Compact metric summary of bay capacity
    │   │   ├── CameraStatus.jsx      # Telemetry badge: AI Camera Live, Offline, Last Synced
    │   │   ├── MysoreLeafletMap.jsx  # Leaflet map instance centered on Mysuru (12.2958° N, 76.6394° E)
    │   │   ├── ParkingCard.jsx       # Hub discovery card (distance, price/hr in ₹, vacant spots)
    │   │   ├── ParkingList.jsx       # Grid list wrapper for parking cards with clean empty state
    │   │   ├── ParkingMap.jsx        # Interactive OpenStreetMap with custom SVG bay markers
    │   │   └── SlotGrid.jsx          # Interactive camera slot visualizer with real-time states
    │   ├── payment/                  # Payment and checkout components
    │   │   ├── CheckoutForm.jsx      # Indian payment options (UPI, GPay, Cards) + Stripe Test Mode
    │   │   ├── PaymentCard.jsx       # Saved card and UPI VPA display item with DEMO badge
    │   │   ├── PaymentStatus.jsx     # Payment status indicator (Success, Processing, Pending)
    │   │   ├── PaymentSummary.jsx    # Transparent cost breakdown in INR (base, GST, platform fee)
    │   │   └── StripeTestModal.jsx   # Stripe Checkout Test Mode modal with INR amounts, card & UPI test simulation
    │   ├── profile/                  # Driver profile drawer
    │   │   └── ProfileDrawer.jsx     # Ola/Uber style slide-out right drawer with avatar & shortcuts
    │   └── vehicle/                  # Vehicle management components
    │       ├── VehicleCard.jsx       # Vehicle plate display with type icon and default badge
    │       └── VehicleForm.jsx       # Add/edit vehicle modal with plate format validation
    ├── context/                      # Global React Context providers
    │   ├── AuthContext.jsx           # Auth state, login/logout, sample mode toggle, 5 demo drivers
    │   ├── NotificationContext.jsx   # Toast messaging and notification center state
    │   └── ThemeContext.jsx          # UI theme management defaulting to 'light'
    ├── hooks/                        # Custom React hooks
    │   ├── useGeolocation.js         # Browser GPS locator with reverse geocode integration
    │   ├── useNotifications.js       # Notification dispatcher and read-state hook
    │   └── useParkingStatus.js       # Polling and WebSocket hook for bay availability
    ├── pages/                        # Screen views wired to URL routes
    │   ├── auth/
    │   │   ├── ForgotPassword.jsx    # Reset password request form with email verification
    │   │   ├── LocationPermission.jsx# Location screen (GPS or searchable cascading selector)
    │   │   ├── Login.jsx             # First screen: Brand logo, tagline "Find it. Park it. Move on.", email/pwd
    │   │   └── Register.jsx          # Registration: Name, Mobile, Email, Password, Cascading Location
    │   ├── onboarding/
    │   │   ├── DriverProfileOnboarding.jsx # Step 2: Driver full name and mobile number entry
    │   │   └── VehicleOnboarding.jsx       # Step 3: Vehicle-first setup (brand, model, category, colour)
    │   ├── dashboard/
    │   │   └── Dashboard.jsx         # Driver view: Greeting, search card, visible demo data option, map, nearby cards
    │   ├── errors/
    │   │   └── NotFound.jsx          # 404 error page with button to return to Dashboard
    │   ├── explore/
    │   │   └── Explore.jsx           # Parking discovery: destination search with smart locality matching, visible demo data button
    │   ├── history/
    │   │   └── ParkingHistory.jsx    # Comprehensive parking history, invoices, and filter tabs
    │   ├── parking/
    │   │   └── ParkingDetails.jsx    # Hub details, camera telemetry, slot breakdown, get directions
    │   ├── payments/
    │   │   ├── Checkout.jsx          # Complete booking & payment checkout screen
    │   │   ├── PaymentResult.jsx     # Post-payment result & parking activation voucher
    │   │   └── Payments.jsx          # Saved payment methods, wallet, and transaction history
    │   ├── profile/
    │   │   └── Profile.jsx           # Full account profile, vehicle shortcuts, and location changer
    │   ├── sessions/
    │   │   ├── SessionDetails.jsx    # Active parking timer, bay number, and extend parking option
    │   │   └── Sessions.jsx          # Driver active and past parking sessions list
    │   ├── settings/
    │   │   ├── AppearanceSettings.jsx # Theme and density controls
    │   │   ├── NotificationSettings.jsx # SMS, WhatsApp, and push alert toggles
    │   │   ├── PrivacySettings.jsx   # Data retention, location sharing, account deletion
    │   │   └── Settings.jsx          # Unified settings tab with dedicated "Load Sample Data" tab
    │   ├── support/
    │   │   └── HelpSupport.jsx       # FAQs, helpline contacts (Mysore support), ticket form
    │   └── vehicles/
    │       └── Vehicles.jsx          # Vehicle list, add new vehicle, delete, make default
    ├── routes/
    │   └── AppRoutes.jsx             # React Router configuration with ProtectedRoute wrappers
    ├── services/                     # Data access and API services
    │   ├── api.js                    # Axios instance with base URL, timeout, auth bearer injection
    │   ├── authService.js            # Google Identity Services (GIS) ID token verification endpoint caller
    │   ├── locationService.js        # Fetches parking hubs from backend; sample mode fallback
    │   ├── mockData.js               # 5 realistic Mysore hubs, slot layouts, and demo dataset
    │   ├── parkingService.js         # Parking availability and slot reservation endpoints
    │   ├── paymentService.js         # Payment session creation, status check, transaction store
    │   ├── sessionService.js         # Active parking session storage and history persistence
    │   └── vehicleService.js         # Driver vehicle management persisted to localStorage
    ├── styles/                       # Supplementary CSS
    │   ├── components.css            # Custom button, card, and form component classes
    │   └── variables.css             # CSS custom properties and color variables
    └── utils/                        # Pure utility functions and data constants
        ├── constants.js              # Application constants (app name, branding, storage keys)
        ├── dateHelpers.js            # Indian date/time formatters, durations, relative timestamps
        ├── formatters.js             # INR currency formatting (₹), vehicle plate uppercase, distances
        ├── locationData.js           # Multi-country dataset, 28 Indian States & 8 UTs, Karnataka districts, Mysuru localities
        └── validators.js             # Indian mobile numbers, email, vehicle plate regex validators
```
