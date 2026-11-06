import React, { useState } from 'react';
import { ParkitProvider, useParkit } from './context/ParkitContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import ParkingBaysPage from './pages/ParkingBaysPage';
import HealthPaymentsPage from './pages/HealthPaymentsPage';
import SettingsPage from './pages/SettingsPage';
import ManualStatusChangeModal from './components/ManualStatusChangeModal';
import AddLocationModal from './components/AddLocationModal';
import { CheckCircle2 } from 'lucide-react';

function DashboardShell() {
  const { 
    isAuthenticated, 
    isLocationSetupActive, 
    setIsLocationSetupActive,
    toastMessage 
  } = useParkit();
  
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bays' | 'health-payments' | 'settings'
  const [selectedSpotForOverride, setSelectedSpotForOverride] = useState(null);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);

  // STEP 1: OWNER LOGIN
  // When owner opens the website or is not authenticated, display the login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // STEP 2: ADD PARKING LOCATION (Immediately after successful login on first setup)
  // Do not show the Overview Dashboard yet!
  if (isLocationSetupActive) {
    return (
      <AddLocationModal 
        isInitialSetup={true}
        onClose={() => setIsLocationSetupActive(false)}
      />
    );
  }

  // STEP 3: OVERVIEW DASHBOARD & SUBSEQUENT PAGES
  // After owner successfully saves & activates location, redirect to Overview Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-gray-900">
      
      {/* Clean Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddLocation={() => setIsAddLocationModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewPage
            setActiveTab={setActiveTab}
            onSelectSpotForOverride={(spot) => setSelectedSpotForOverride(spot)}
          />
        )}

        {activeTab === 'bays' && (
          <ParkingBaysPage
            onSelectSpotForOverride={(spot) => setSelectedSpotForOverride(spot)}
          />
        )}

        {activeTab === 'health-payments' && (
          <HealthPaymentsPage />
        )}

        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </main>

      {/* Manual Status Change Pop-up */}
      {selectedSpotForOverride && (
        <ManualStatusChangeModal
          spot={selectedSpotForOverride}
          onClose={() => setSelectedSpotForOverride(null)}
        />
      )}

      {/* Subsequent Add Parking Location Pop-up (when clicking Add Location inside dashboard) */}
      {isAddLocationModalOpen && (
        <AddLocationModal
          isInitialSetup={false}
          onClose={() => setIsAddLocationModalOpen(false)}
        />
      )}

      {/* Clean Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-xl text-xs text-gray-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ParkitProvider>
      <DashboardShell />
    </ParkitProvider>
  );
}
