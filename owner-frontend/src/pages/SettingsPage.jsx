import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  User, 
  MapPin, 
  Video, 
  Bell, 
  Lock, 
  Save, 
  LogOut, 
  CheckCircle2, 
  RefreshCw,
  Sliders
} from 'lucide-react';

export default function SettingsPage() {
  const { 
    currentUser, 
    updateProfile, 
    activeLocation, 
    settings, 
    updateSettings, 
    camera, 
    reconnectCamera, 
    logout, 
    resetToFirstTimeSetup,
    showToast 
  } = useParkit();

  // Profile Form State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);

  // Parking Settings State
  const [hourlyRate, setHourlyRate] = useState(settings.hourlyRate);
  const [availableHours, setAvailableHours] = useState(settings.availableHours);
  const [parkingSpaces, setParkingSpaces] = useState(activeLocation.totalSpots);

  // Notifications State
  const [paymentAlerts, setPaymentAlerts] = useState(settings.paymentAlerts);
  const [parkingAlerts, setParkingAlerts] = useState(settings.parkingAlerts);
  const [cameraAlerts, setCameraAlerts] = useState(settings.cameraAlerts);

  // Account Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });
  };

  const handleSaveParkingSettings = (e) => {
    e.preventDefault();
    updateSettings({
      hourlyRate: parseFloat(hourlyRate),
      availableHours
    });
  };

  const handleSaveNotifications = () => {
    updateSettings({
      paymentAlerts,
      parkingAlerts,
      cameraAlerts
    });
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setCurrentPassword('');
    setNewPassword('');
    showToast("Password updated successfully.");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your owner profile, parking rates, connected cameras, and system notifications.
        </p>
      </div>

      {/* 1. Owner Profile Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Owner Profile</h3>
            <p className="text-xs text-gray-500">Your personal details and facility supervisor contact</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Owner Full Name
              </label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Parking Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Parking Settings</h3>
            <p className="text-xs text-gray-500">Configure rates, operating hours, and capacity for {activeLocation.name}</p>
          </div>
        </div>

        <form onSubmit={handleSaveParkingSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Hourly Parking Rate (₹ / hr)
              </label>
              <input
                type="number"
                min="0"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={availableHours}
                onChange={(e) => setAvailableHours(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Number of Parking Spaces
              </label>
              <input
                type="number"
                disabled
                value={parkingSpaces}
                className="w-full px-3 py-2 text-xs font-mono bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Parking Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Camera Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Camera Settings</h3>
            <p className="text-xs text-gray-500">Configure connected stream and hardware reconnection</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <span className="font-semibold text-gray-700 block">Selected Camera</span>
            <span className="text-gray-900 font-bold block">{camera.name}</span>
            <span className="text-gray-500 text-[11px] block">{camera.videoQuality}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-gray-50 border border-gray-200 space-y-1">
            <span className="font-semibold text-gray-700 block">Connection Status</span>
            <span className="text-green-700 font-bold block">{camera.status} (Stable)</span>
            <span className="text-gray-500 text-[11px] block">{camera.address}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={reconnectCamera}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
            <span>Test & Reconnect Camera</span>
          </button>
        </div>
      </div>

      {/* 4. Notifications Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Notifications & Alerts</h3>
            <p className="text-xs text-gray-500">Choose when to receive real-time system alerts</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-gray-900 block">Payment Alerts</span>
              <span className="text-xs text-gray-500">Notify when drivers complete test payments or transactions fail</span>
            </div>
            <input
              type="checkbox"
              checked={paymentAlerts}
              onChange={(e) => {
                setPaymentAlerts(e.target.checked);
                updateSettings({ paymentAlerts: e.target.checked });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-gray-900 block">Parking & Occupancy Alerts</span>
              <span className="text-xs text-gray-500">Notify when cars park or spaces need visual checking</span>
            </div>
            <input
              type="checkbox"
              checked={parkingAlerts}
              onChange={(e) => {
                setParkingAlerts(e.target.checked);
                updateSettings({ parkingAlerts: e.target.checked });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div>
              <span className="font-semibold text-xs text-gray-900 block">Camera Hardware Alerts</span>
              <span className="text-xs text-gray-500">Notify if camera stream latency increases or disconnects</span>
            </div>
            <input
              type="checkbox"
              checked={cameraAlerts}
              onChange={(e) => {
                setCameraAlerts(e.target.checked);
                updateSettings({ cameraAlerts: e.target.checked });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* 5. Account Settings Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
          <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Account Security</h3>
            <p className="text-xs text-gray-500">Change password and manage active session</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center space-x-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={resetToFirstTimeSetup}
                className="px-3.5 py-2 text-xs font-medium rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 transition-colors"
                title="Re-run the initial 3-step setup flow"
              >
                Re-test Entry Setup Flow
              </button>

              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>

    </div>
  );
}
