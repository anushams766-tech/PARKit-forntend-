import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  Bell, 
  User, 
  LogOut, 
  Check, 
  MapPin, 
  ChevronDown, 
  Menu, 
  X,
  ExternalLink,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAddLocation }) {
  const { 
    currentUser, 
    logout, 
    notifications, 
    markAllNotificationsRead, 
    locations, 
    activeLocationId, 
    setActiveLocationId, 
    activeLocation 
  } = useParkit();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.unread).length;

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'bays', label: 'Parking Bays' },
    { id: 'health-payments', label: 'Health & Payments' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Exact PARKit Logo & Facility Switcher */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-3 cursor-pointer group select-none"
            >
              {/* Exact Logo Image */}
              <div className="h-10 w-10 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                <img 
                  src="/logo.png" 
                  alt="PARKit" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-gray-900 leading-none">
                  PARKit
                </span>
                <span className="text-[11px] font-medium text-gray-500 leading-tight mt-0.5">
                  Owner Portal
                </span>
              </div>
            </div>

            {/* Location Switcher Pill */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
                <span className="max-w-[170px] truncate">{activeLocation?.name}</span>
                <ChevronDown className="h-3 w-3 text-gray-400" />
              </button>

              {showLocationMenu && (
                <div 
                  className="absolute left-0 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-lg py-2 z-50 text-xs"
                  onClick={() => setShowLocationMenu(false)}
                >
                  <div className="px-3 py-1 text-[11px] font-bold uppercase text-gray-400 tracking-wider">
                    Parking Facilities
                  </div>
                  {locations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocationId(loc.id)}
                      className={`w-full text-left px-3 py-2 flex items-start space-x-2 transition-colors ${
                        loc.id === activeLocationId
                          ? 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <MapPin className="h-3.5 w-3.5 mt-0.5 text-blue-600 shrink-0" />
                      <div>
                        <div className="text-gray-900">{loc.name}</div>
                        <div className="text-[11px] text-gray-500 font-normal">{loc.level}</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                    <button
                      onClick={onOpenAddLocation}
                      className="w-full text-left px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded flex items-center space-x-1.5 font-medium"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Parking Location...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center: Navigation Links (Highlighted in Blue) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isSelected
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Notifications & Owner Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Add Location Button */}
            <button
              onClick={onOpenAddLocation}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Location</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-gray-200 shadow-xl py-3 z-50 text-xs">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-blue-600 hover:underline text-[11px] font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-3 transition-colors ${n.unread ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-start justify-between">
                          <span className={`font-semibold text-gray-900 ${n.unread ? 'text-blue-900' : ''}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-2 shrink-0">{n.time}</span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-0.5">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Owner Profile Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-gray-900">{currentUser.name}</div>
                  <div className="text-[11px] text-gray-500">{currentUser.role}</div>
                </div>
                <ChevronDown className="h-3 w-3 text-gray-400 hidden sm:block" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-bold text-gray-900">{currentUser.name}</div>
                    <div className="text-gray-500 text-[11px]">{currentUser.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <User className="h-3.5 w-3.5 text-gray-500" />
                    <span>Owner Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2 font-medium"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 md:hidden rounded-lg"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === item.id
                    ? 'text-blue-600 bg-blue-50 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={() => {
                  onOpenAddLocation();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Parking Location</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
