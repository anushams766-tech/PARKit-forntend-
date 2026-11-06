# PARKit – Antigravity CLI Quick Start Guide

> **Project**: PARKit – Smart Parking Platform  
> **Workspace Directory**: `c:\Users\anush\Documents\PARKit`  
> **Architecture**: React 19 + Vite 6 + Tailwind CSS v4 + React Router v7  
> **Target Tool**: Antigravity CLI

---

## 1. Mandatory Antigravity CLI Continuation Directive

> [!IMPORTANT]
> **Read this directive before executing any commands or making code changes:**
>
> "You are continuing development of an existing PARKit application.
>
> Do not rebuild the application from scratch.
>
> First inspect HANDOFF_TO_ANTIGRAVITY_CLI.md, PROJECT_STRUCTURE.md and DEVELOPMENT_STATUS.md.
>
> Then inspect the actual project files to verify the handover information.
>
> Preserve the existing architecture, working components, dependencies and design decisions.
>
> Do not delete working code or replace the existing project with a template.
>
> Do not automatically load demo data.
>
> Do not invent backend APIs, credentials, payment confirmations or real parking availability.
>
> Prioritize completing the unfinished functionality documented in DEVELOPMENT_STATUS.md.
>
> Work incrementally, test changes and preserve existing functionality."

---

## 2. Quick Start Commands

Execute the following commands in PowerShell from the project root:

### 2.1 Start Development Server
```powershell
cd c:\Users\anush\Documents\PARKit
npm run dev
```
The application will start locally at **`http://localhost:5173`**.

### 2.2 Verify Production Build
```powershell
cd c:\Users\anush\Documents\PARKit
npm run build
```
Vite compiles the application cleanly into `dist/`.

### 2.3 Preview Production Build
```powershell
cd c:\Users\anush\Documents\PARKit
npm run preview
```

---

## 3. Important Files to Inspect First

When entering the codebase in Antigravity CLI, inspect these core files in order:

1. **Context & Documentation**:
   - `HANDOFF_TO_ANTIGRAVITY_CLI.md`: Master architectural context, user flow, and design specifications.
   - `PROJECT_STRUCTURE.md`: Comprehensive map of all folders, components, and services.
   - `DEVELOPMENT_STATUS.md`: Feature-by-feature classification of completed, partial, and blocked items.

2. **Application Core & Routing**:
   - `src/App.jsx`: Top-level React context providers (`AuthContext`, `ThemeContext`, `NotificationContext`).
   - `src/routes/AppRoutes.jsx`: Route definitions and route guards (`ProtectedRoute`).

3. **Authentication & Location**:
   - `src/pages/auth/Login.jsx`: Entry point for unauthenticated users.
   - `src/pages/auth/LocationPermission.jsx`: Post-login location permission and GPS detection flow.
   - `src/context/AuthContext.jsx`: Auth state, user profile, and manual sample mode separation.

4. **Dashboard & Mobility UX**:
   - `src/pages/dashboard/Dashboard.jsx`: Primary driver view with greeting, location chip, search, and Leaflet map.
   - `src/components/layout/AppLayout.jsx` & `src/components/layout/Sidebar.jsx`: Navigation layout (no bottom bar).
   - `src/components/profile/ProfileDrawer.jsx`: Ola/Uber inspired slide-out profile drawer.

5. **Services & Utilities**:
   - `src/services/api.js`: Axios configuration connecting to `VITE_API_BASE_URL`.
   - `src/services/locationService.js`: Parking hub discovery with backend and offline support.
   - `src/utils/locationData.js`: Cascading Mysore hierarchy (India → Karnataka → Mysore → Localities).

---

## 4. Key Rules for Continuing Development

1. **Brand & Identity Integrity**:
   - Use the official logo `public/images/parkit-logo.png` exactly as provided.
   - Never stretch, crop, recolor, or redraw the logo. Always apply `object-contain`.
   - The brand tagline is: *Find it. Park it. Move on.*

2. **Design Theme & Palette**:
   - **Theme**: Royal Blue (`#2563EB`), Deep Navy (`#163A70`), Light Blue (`#EFF6FF`), White (`#FFFFFF`).
   - Default to **light mode**. Never use a dark dashboard.
   - Reserve **Green** (`#16A34A`) strictly for available parking bays.

3. **Currency & Localization**:
   - Use **Indian Rupees (INR, ₹)** throughout the entire application.
   - All dates, times, and phone numbers follow Indian formatting conventions.

4. **Navigation**:
   - Maintain **Sidebar navigation only**. Do NOT reintroduce bottom navigation bars.

5. **Clean Data vs. Sample Data**:
   - The app runs in **clean mode by default**. Do not auto-populate fake parking spots or fake vehicles.
   - Sample data is only accessible if explicitly loaded via **Settings → Load Sample Data** using one of the 5 predefined Mysore profiles (Anusha, Vismaya, Vaishakh, Tarun, Deepak).

6. **Backend Integration**:
   - If the FastAPI backend is running at `http://localhost:8000`, the frontend seamlessly communicates with it.
   - When offline, display honest empty states and prototype notices.

