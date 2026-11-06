import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_LOCATIONS,
  INITIAL_SPOTS,
  INITIAL_CAMERA,
  INITIAL_PAYMENTS,
  INITIAL_STATUS_HISTORY,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

const ParkitContext = createContext(null);

export function ParkitProvider({ children }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkit_auth') === 'true';
  });

  // Track whether first-time location setup has been completed
  const [hasCompletedLocationSetup, setHasCompletedLocationSetup] = useState(() => {
    return localStorage.getItem('parkit_setup_completed') === 'true';
  });

  // Controls whether the mandatory Add Location step is currently active
  const [isLocationSetupActive, setIsLocationSetupActive] = useState(() => {
    // If authenticated but setup not completed, active is true
    const auth = localStorage.getItem('parkit_auth') === 'true';
    const setup = localStorage.getItem('parkit_setup_completed') === 'true';
    return auth && !setup;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('parkit_user');
    return saved ? JSON.parse(saved) : {
      name: "Alex Vance",
      email: "owner@parkit.demo",
      phone: "+91 98450 12345",
      role: "Parking Facility Owner"
    };
  });

  // Core Data
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('parkit_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [activeLocationId, setActiveLocationId] = useState(() => {
    return localStorage.getItem('parkit_active_loc') || 'LOC-01';
  });

  const [spots, setSpots] = useState(() => {
    const saved = localStorage.getItem('parkit_spots');
    return saved ? JSON.parse(saved) : INITIAL_SPOTS;
  });

  const [camera, setCamera] = useState(() => {
    const saved = localStorage.getItem('parkit_camera');
    return saved ? JSON.parse(saved) : INITIAL_CAMERA;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('parkit_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [statusHistory, setStatusHistory] = useState(() => {
    const saved = localStorage.getItem('parkit_history');
    return saved ? JSON.parse(saved) : INITIAL_STATUS_HISTORY;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('parkit_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('parkit_settings');
    return saved ? JSON.parse(saved) : {
      hourlyRate: 40,
      availableHours: "24/7 (Mon - Sun)",
      paymentAlerts: true,
      parkingAlerts: true,
      cameraAlerts: true
    };
  });

  const [toastMessage, setToastMessage] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('parkit_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('parkit_setup_completed', hasCompletedLocationSetup ? 'true' : 'false');
  }, [hasCompletedLocationSetup]);

  useEffect(() => {
    localStorage.setItem('parkit_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('parkit_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('parkit_active_loc', activeLocationId);
  }, [activeLocationId]);

  useEffect(() => {
    localStorage.setItem('parkit_spots', JSON.stringify(spots));
  }, [spots]);

  useEffect(() => {
    localStorage.setItem('parkit_camera', JSON.stringify(camera));
  }, [camera]);

  useEffect(() => {
    localStorage.setItem('parkit_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('parkit_history', JSON.stringify(statusHistory));
  }, [statusHistory]);

  useEffect(() => {
    localStorage.setItem('parkit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('parkit_settings', JSON.stringify(settings));
  }, [settings]);

  // Derived Active Data
  const activeLocation = locations.find(l => l.id === activeLocationId) || locations[0] || {
    id: "LOC-01",
    name: "PARKit Tech Park - Main Lot",
    level: "Ground Floor - Area A",
    address: "Bengaluru, KA",
    latitude: 12.9716,
    longitude: 77.5946,
    totalSpots: 6,
    hourlyRate: 40,
    availableHours: "24/7",
    cameraId: "CAM-01"
  };

  const activeSpots = spots.filter(s => s.locationId === activeLocation?.id);

  // Summary Metrics
  const totalSpots = activeSpots.length;
  const availableSpots = activeSpots.filter(s => s.status === 'AVAILABLE').length;
  const parkedSpots = activeSpots.filter(s => s.status === 'PARKED').length;
  const needsCheckSpots = activeSpots.filter(s => s.status === 'NEEDS_CHECK').length;

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const login = (email, password) => {
    if (email && password) {
      setIsAuthenticated(true);
      const isCompleted = localStorage.getItem('parkit_setup_completed') === 'true';
      if (!isCompleted) {
        // STEP 2: Immediately open Add Parking Location pop-up, do not show Overview Dashboard yet
        setIsLocationSetupActive(true);
        showToast("Welcome! Please set up and activate your parking location to begin.");
      } else {
        setIsLocationSetupActive(false);
        showToast(`Welcome back, ${currentUser.name}!`);
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsLocationSetupActive(false);
    showToast("You have been signed out.");
  };

  // Reset flow to test the exact entry flow from scratch
  const resetToFirstTimeSetup = () => {
    localStorage.removeItem('parkit_setup_completed');
    setHasCompletedLocationSetup(false);
    setIsLocationSetupActive(true);
    showToast("Reset to first-time setup flow. Showing Add Location step.");
  };

  // Spot Status Management
  const updateSpotStatus = (spotId, newStatus, reason = "") => {
    const target = spots.find(s => s.id === spotId);
    if (!target) return;

    const timeStr = "Today, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isReset = newStatus === 'RESET_TO_CAMERA';
    const effectiveStatus = isReset ? target.cameraReading : newStatus;

    setSpots(prev => prev.map(s => {
      if (s.id === spotId) {
        return {
          ...s,
          status: effectiveStatus,
          manualOverride: isReset ? null : {
            overriddenBy: currentUser.name,
            reason: reason || "Owner manual change",
            at: timeStr
          },
          lastChecked: "Just now",
          vehicleInfo: effectiveStatus === 'PARKED' ? (s.vehicleInfo || "Vehicle Parked (Manual)") : null
        };
      }
      return s;
    }));

    // Record in history table
    const newHistory = {
      id: `HIST-${Date.now().toString().slice(-4)}`,
      spot: target.spotNumber,
      changedTo: effectiveStatus,
      changedBy: currentUser.name,
      reason: reason || (isReset ? "Reset to camera reading" : "Owner manual status change"),
      time: timeStr
    };
    setStatusHistory(prev => [newHistory, ...prev]);

    showToast(`${target.spotNumber} status changed to ${effectiveStatus}`);
  };

  // Toggle Camera Detection ON / OFF
  const toggleCameraDetection = () => {
    setCamera(prev => {
      const nextState = !prev.isDetectionActive;
      showToast(`Camera detection ${nextState ? 'turned ON' : 'paused (OFF)'}`);
      return {
        ...prev,
        isDetectionActive: nextState
      };
    });
  };

  // Reconnect / Refresh Camera
  const reconnectCamera = () => {
    setCamera(prev => ({
      ...prev,
      status: "ONLINE",
      lastUpdated: new Date().toLocaleTimeString(),
      lastSignal: "Just now"
    }));
    showToast("Camera reconnected successfully! Feed is live.");
  };

  // Add Location (3-Step Flow)
  const addLocation = (locData) => {
    const newId = `LOC-0${locations.length + 1}`;
    const newLocation = {
      ...locData,
      id: newId,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setLocations(prev => [newLocation, ...prev]);

    // Create spots for this location
    const count = parseInt(locData.totalSpots) || 6;
    const newSpots = [];
    for (let i = 1; i <= count; i++) {
      newSpots.push({
        id: `spot-${newId.toLowerCase()}-${i}`,
        spotNumber: `Spot ${i}`,
        spotCode: `P${i}`,
        locationId: newId,
        level: locData.level || "Ground Floor - Main Lot",
        status: i === 2 || i === 4 ? "PARKED" : i === 5 ? "NEEDS_CHECK" : "AVAILABLE",
        cameraReading: i === 2 || i === 4 ? "PARKED" : i === 5 ? "UNCERTAIN" : "AVAILABLE",
        confidence: i === 5 ? 0.58 : 0.95,
        vehicleInfo: i === 2 ? "Red Hatchback (KA-05-MQ-4821)" : i === 4 ? "Blue SUV (KA-01-AB-1903)" : null,
        emptyDuration: i === 1 ? "1 hr 45 mins" : i === 3 ? "3 hrs 10 mins" : i === 6 ? "4 hrs 20 mins" : null,
        lastChecked: "Just now",
        notes: i === 5 ? "Confidence score below threshold (58%). Requires check." : "Reference background verified",
        manualOverride: null
      });
    }

    setSpots(prev => [...newSpots, ...prev]);
    setActiveLocationId(newId);

    // Complete setup flow and redirect to Overview Dashboard
    setHasCompletedLocationSetup(true);
    setIsLocationSetupActive(false);

    showToast(`Location "${locData.name}" activated! Redirecting to Overview Dashboard.`);
  };

  // Update Settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast("Settings updated successfully!");
  };

  // Update Profile
  const updateProfile = (profileData) => {
    setCurrentUser(prev => ({ ...prev, ...profileData }));
    showToast("Profile details saved!");
  };

  // Download / Export Report as CSV
  const downloadReport = (type = "overview") => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === "history") {
      csvContent += "Spot,Changed To,Changed By,Reason,Time\n";
      statusHistory.forEach(h => {
        csvContent += `"${h.spot}","${h.changedTo}","${h.changedBy}","${h.reason || ''}","${h.time}"\n`;
      });
    } else if (type === "payments") {
      csvContent += "Transaction ID,Driver,Spot,Duration,Amount,Status,Time\n";
      payments.forEach(p => {
        csvContent += `"${p.id}","${p.driver}","${p.spot}","${p.timeParked}","INR ${p.amount}","${p.status}","${p.date}"\n`;
      });
    } else {
      csvContent += "Spot Number,Location,Status,Camera Reading,Confidence,Vehicle Info,Last Checked\n";
      activeSpots.forEach(s => {
        csvContent += `"${s.spotNumber}","${activeLocation.name}","${s.status}","${s.cameraReading}","${(s.confidence * 100).toFixed(0)}%","${s.vehicleInfo || 'None'}","${s.lastChecked}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `parkit_${type}_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Downloaded ${type} report CSV.`);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    hasCompletedLocationSetup,
    setHasCompletedLocationSetup,
    isLocationSetupActive,
    setIsLocationSetupActive,
    resetToFirstTimeSetup,
    currentUser,
    updateProfile,
    locations,
    activeLocationId,
    setActiveLocationId,
    activeLocation,
    spots,
    activeSpots,
    totalSpots,
    availableSpots,
    parkedSpots,
    needsCheckSpots,
    camera,
    toggleCameraDetection,
    reconnectCamera,
    payments,
    statusHistory,
    notifications,
    markAllNotificationsRead,
    settings,
    updateSettings,
    updateSpotStatus,
    addLocation,
    downloadReport,
    toastMessage,
    showToast
  };

  return (
    <ParkitContext.Provider value={value}>
      {children}
    </ParkitContext.Provider>
  );
}

export function useParkit() {
  const context = useContext(ParkitContext);
  if (!context) {
    throw new Error("useParkit must be used within a ParkitProvider");
  }
  return context;
}
