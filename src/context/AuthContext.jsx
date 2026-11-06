import { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_USER_LOCATION } from '../utils/locationData';
import { DEMO_VEHICLES, DEMO_SESSIONS, DEMO_PAYMENTS } from '../services/mockData';

const AuthContext = createContext();

// Exactly the five demo profiles specified for manual prototype testing
export const FIVE_DEMO_DRIVERS = [
  {
    id: 'usr_anusha_01',
    name: 'Anusha',
    email: 'anusha.driver@parkit.in',
    phone: '+91 98450 48210',
    primaryVehicle: 'Maruti Suzuki Swift',
    plate: 'KA09MN4821',
    vehicleType: 'Hatchback',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: { country: 'India', state: 'Karnataka', district: 'Mysore (Mysuru)', locality: 'Vijayanagar' },
    joinedDate: '2025-01-10',
  },
  {
    id: 'usr_vismaya_02',
    name: 'Vismaya',
    email: 'vismaya.driver@parkit.in',
    phone: '+91 98451 73160',
    primaryVehicle: 'BMW 3 Series',
    plate: 'KA09AB7316',
    vehicleType: 'Luxury Sedan',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    location: { country: 'India', state: 'Karnataka', district: 'Mysore (Mysuru)', locality: 'Jayalakshmipuram' },
    joinedDate: '2025-01-14',
  },
  {
    id: 'usr_vaishakh_03',
    name: 'Vaishakh',
    email: 'vaishakh.driver@parkit.in',
    phone: '+91 98452 92540',
    primaryVehicle: 'Audi Q5 Sportback',
    plate: 'KA09CD9254',
    vehicleType: 'Premium SUV',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: { country: 'India', state: 'Karnataka', district: 'Mysore (Mysuru)', locality: 'Gokulam' },
    joinedDate: '2025-01-20',
  },
  {
    id: 'usr_tarun_04',
    name: 'Tarun',
    email: 'tarun.driver@parkit.in',
    phone: '+91 98453 61830',
    primaryVehicle: 'Toyota Fortuner',
    plate: 'KA09EF6183',
    vehicleType: 'Full-Size SUV',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: { country: 'India', state: 'Karnataka', district: 'Mysore (Mysuru)', locality: 'Hebbal' },
    joinedDate: '2025-02-01',
  },
  {
    id: 'usr_deepak_05',
    name: 'Deepak',
    email: 'deepak.driver@parkit.in',
    phone: '+91 98454 30720',
    primaryVehicle: 'Toyota Innova Crysta',
    plate: 'KA09GH3072',
    vehicleType: 'Touring MUV',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    location: { country: 'India', state: 'Karnataka', district: 'Mysore (Mysuru)', locality: 'Kuvempunagar' },
    joinedDate: '2025-02-05',
  },
];

export function AuthProvider({ children }) {
  // Current logged in driver user
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('parkit_driver_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkit_driver_user') !== null;
  });

  // Location permission state
  const [hasLocationPermission, setHasLocationPermission] = useState(() => {
    return localStorage.getItem('parkit_location_configured') === 'true';
  });

  // Current active location (stored in profile and localStorage)
  const [currentLocation, setCurrentLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('parkit_current_location');
      return saved ? JSON.parse(saved) : DEFAULT_USER_LOCATION;
    } catch {
      return DEFAULT_USER_LOCATION;
    }
  });

  // Sample Mode state (only loaded upon explicit user request)
  const [isSampleMode, setIsSampleMode] = useState(() => {
    return localStorage.getItem('parkit_sample_mode') === 'true';
  });

  const [sampleProfile, setSampleProfile] = useState(() => {
    const profId = localStorage.getItem('parkit_sample_profile_id');
    return profId ? FIVE_DEMO_DRIVERS.find(d => d.id === profId) || null : null;
  });

  // Sync user state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('parkit_driver_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('parkit_driver_user');
      localStorage.removeItem('parkit_auth_token');
      setIsAuthenticated(false);
    }
  }, [user]);

  // Sync location to localStorage
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('parkit_current_location', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  const login = async (email, password) => {
    // Normal authentic login: creates or retrieves user account
    const existingUser = user || {
      id: 'driver_' + Date.now().toString(36),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      phone: '+91 98000 00000',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: null,
    };

    setUser(existingUser);
    setIsAuthenticated(true);
    localStorage.setItem('parkit_auth_token', 'token_' + existingUser.id);
    return existingUser;
  };

  const loginWithGoogle = (backendUser, token) => {
    setUser(backendUser);
    setIsAuthenticated(true);
    localStorage.setItem('parkit_driver_user', JSON.stringify(backendUser));
    if (token) {
      localStorage.setItem('parkit_auth_token', token);
    }
    if (backendUser.location) {
      setCurrentLocation(backendUser.location);
      localStorage.setItem('parkit_current_location', JSON.stringify(backendUser.location));
      localStorage.setItem('parkit_location_configured', 'true');
      setHasLocationPermission(true);
    }
    return backendUser;
  };

  const register = async ({ name, email, phone, location }) => {
    const newUser = {
      id: 'driver_' + Date.now().toString(36),
      name,
      email,
      phone,
      joinedDate: new Date().toISOString().split('T')[0],
      location: location || DEFAULT_USER_LOCATION,
      avatar: null,
    };

    setUser(newUser);
    if (location) {
      setCurrentLocation(location);
    }
    setHasLocationPermission(false);
    localStorage.removeItem('parkit_location_configured');
    setIsAuthenticated(true);
    localStorage.setItem('parkit_auth_token', 'token_' + newUser.id);
    return newUser;
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('parkit_driver_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updateLocation = (newLoc) => {
    setCurrentLocation(newLoc);
    setHasLocationPermission(true);
    localStorage.setItem('parkit_location_configured', 'true');
    localStorage.setItem('parkit_current_location', JSON.stringify(newLoc));
    if (user) {
      updateProfile({ location: newLoc });
    }
  };

  // Explicitly Load Sample Data (1 of the 5 demo drivers)
  const loadSampleProfile = (profileId) => {
    const matched = FIVE_DEMO_DRIVERS.find(d => d.id === profileId);
    if (!matched) return false;

    setIsSampleMode(true);
    setSampleProfile(matched);
    localStorage.setItem('parkit_sample_mode', 'true');
    localStorage.setItem('parkit_sample_profile_id', profileId);

    // Apply sample driver profile
    setUser(matched);
    updateLocation({
      ...matched.location,
      coordinates: { lat: 12.3051, lng: 76.6554 },
      isDetected: false,
    });

    // Populate sample vehicle in vehicle storage
    const sampleVehicle = DEMO_VEHICLES.find(v => v.driverName === matched.name) || DEMO_VEHICLES[0];
    localStorage.setItem('parkit_user_vehicles', JSON.stringify([sampleVehicle]));

    // Populate sample session history for this driver
    const driverSessions = DEMO_SESSIONS.filter(s => s.driverName === matched.name);
    localStorage.setItem('parkit_user_sessions', JSON.stringify(driverSessions.length > 0 ? driverSessions : DEMO_SESSIONS.slice(0, 2)));

    // Populate sample payments
    const driverPayments = DEMO_PAYMENTS.filter(p => p.driverName === matched.name);
    localStorage.setItem('parkit_user_payments', JSON.stringify(driverPayments.length > 0 ? driverPayments : DEMO_PAYMENTS.slice(0, 2)));

    return true;
  };

  // Reset Sample Data back to Clean Normal Mode
  const resetSampleMode = () => {
    setIsSampleMode(false);
    setSampleProfile(null);
    localStorage.removeItem('parkit_sample_mode');
    localStorage.removeItem('parkit_sample_profile_id');

    // Clean user storage back to user's real or clean state
    localStorage.removeItem('parkit_user_vehicles');
    localStorage.removeItem('parkit_user_sessions');
    localStorage.removeItem('parkit_user_payments');

    // Reset user to clean driver account
    const cleanUser = {
      id: 'driver_clean',
      name: 'Driver User',
      email: 'driver@parkit.in',
      phone: '+91 98450 00000',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: null,
      location: DEFAULT_USER_LOCATION,
    };
    setUser(cleanUser);
    setCurrentLocation(DEFAULT_USER_LOCATION);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsSampleMode(false);
    setSampleProfile(null);
    localStorage.removeItem('parkit_driver_user');
    localStorage.removeItem('parkit_auth_token');
    localStorage.removeItem('parkit_sample_mode');
    localStorage.removeItem('parkit_sample_profile_id');
    localStorage.removeItem('parkit_location_configured');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        currentLocation,
        hasLocationPermission,
        isSampleMode,
        sampleProfile,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        updateLocation,
        loadSampleProfile,
        resetSampleMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
