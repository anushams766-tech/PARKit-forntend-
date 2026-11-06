import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import CascadingLocationPicker from '../common/CascadingLocationPicker';
import {
  X,
  User,
  Mail,
  Phone,
  Camera,
  Car,
  MapPin,
  CreditCard,
  Clock,
  Bell,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  CheckCircle2,
  Edit2,
} from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_IDENTIFIER } from '../../utils/constants';

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, currentLocation, updateProfile, updateLocation, logout, isSampleMode, sampleProfile } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isPaymentMethodsOpen, setIsPaymentMethodsOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  // Edit profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  // Saved location state
  const [tempLocation, setTempLocation] = useState(currentLocation);

  // Saved UPI preference
  const [upiId, setUpiId] = useState(localStorage.getItem('parkit_user_upi') || 'driver@upi');
  const [upiSaved, setUpiSaved] = useState(false);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({ name, phone, email });
    setIsEditProfileOpen(false);
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateLocation(tempLocation);
    setIsLocationModalOpen(false);
  };

  const handleSavePaymentMethod = (e) => {
    e.preventDefault();
    localStorage.setItem('parkit_user_upi', upiId);
    setUpiSaved(true);
    setTimeout(() => {
      setUpiSaved(false);
      setIsPaymentMethodsOpen(false);
    }, 1000);
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in">
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#163A70]">
                Driver Profile
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#172554] hover:bg-white transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Details with Photo */}
            <div className="flex items-center gap-3.5 pt-1">
              <div className="relative group">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#2563EB] shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] font-extrabold text-xl flex items-center justify-center border border-[#BFDBFE]">
                    {user?.name?.charAt(0) || 'D'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#2563EB] text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  title="Upload profile picture"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-extrabold text-sm text-[#163A70] truncate">
                    {user?.name || 'Driver User'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setName(user?.name || '');
                      setPhone(user?.phone || '');
                      setEmail(user?.email || '');
                      setIsEditProfileOpen(true);
                    }}
                    className="text-[11px] font-bold text-[#2563EB] hover:underline flex items-center gap-0.5"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                </div>
                <p className="text-xs text-[#64748B] truncate mt-0.5">
                  {user?.phone || '+91 98450 00000'}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Current Selected Locality Chip */}
            <div
              onClick={() => {
                setTempLocation(currentLocation);
                setIsLocationModalOpen(true);
              }}
              className="mt-3.5 p-2.5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#2563EB] transition-colors cursor-pointer flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-[#64748B] uppercase font-bold block leading-none">
                    {currentLocation?.isDetected ? 'GPS Detected Area' : 'Selected Region'}
                  </span>
                  <span className="font-bold text-[#163A70] text-xs truncate">
                    {currentLocation?.locality || 'Mysore City'}, {currentLocation?.district || 'Mysore'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
            </div>
          </div>

          {/* Menu Items (Ola/Uber inspired list) */}
          <div className="flex-1 py-3 px-3 space-y-1">
            <button
              type="button"
              onClick={() => handleNavigate('/vehicles')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">My Vehicles</h4>
                  <p className="text-[11px] text-[#64748B]">Manage your vehicle registrations</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => {
                setTempLocation(currentLocation);
                setIsLocationModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Saved Location</h4>
                  <p className="text-[11px] text-[#64748B]">Change operating city or district</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaymentMethodsOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Payment Methods</h4>
                  <p className="text-[11px] text-[#64748B]">Manage UPI ID and payment options</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/parking-history')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Parking History</h4>
                  <p className="text-[11px] text-[#64748B]">Past parking sessions &amp; receipts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Notification Preferences</h4>
                  <p className="text-[11px] text-[#64748B]">Parking availability &amp; camera alerts</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Privacy &amp; Security</h4>
                  <p className="text-[11px] text-[#64748B]">Account security &amp; privacy</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavigate('/support')}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">Help and Support</h4>
                  <p className="text-[11px] text-[#64748B]">FAQs &amp; customer care</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>

            <button
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] text-left transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#163A70]">About PARKit</h4>
                  <p className="text-[11px] text-[#64748B]">Version, architecture &amp; terms</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
            </button>
          </div>

          {/* Footer Logout */}
          <div className="p-4 border-t border-[#E2E8F0] bg-white">
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
                navigate('/login');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver Name"
            required
          />
          <Input
            label="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98450 00000"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="driver@example.com"
            required
          />
          <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Saved Location Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Change Operating Region"
      >
        <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
          <CascadingLocationPicker
            value={tempLocation}
            onChange={setTempLocation}
            includeLocality={true}
          />
          <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Update Location
            </Button>
          </div>
        </form>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal
        isOpen={isPaymentMethodsOpen}
        onClose={() => setIsPaymentMethodsOpen(false)}
        title="Manage Payment Methods"
      >
        <form onSubmit={handleSavePaymentMethod} className="space-y-4 text-xs">
          <p className="text-[#64748B]">
            Configure your preferred UPI Virtual Payment Address (VPA) for fast parking checkout.
          </p>
          <Input
            label="UPI ID / VPA (Google Pay / PhonePe / Paytm)"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g. mobile@oksbi, username@upi"
            required
          />
          {upiSaved && (
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>UPI Payment Method Saved!</span>
            </div>
          )}
          <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPaymentMethodsOpen(false)}
            >
              Close
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save UPI ID
            </Button>
          </div>
        </form>
      </Modal>

      {/* About PARKit Modal */}
      <Modal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        title="About PARKit"
      >
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Application:</span>
              <strong className="text-[#163A70]">{APP_NAME} – Smart Parking</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Tagline:</span>
              <strong className="text-[#172554]">{APP_TAGLINE}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Identifier:</span>
              <strong className="font-mono text-[#2563EB]">{APP_IDENTIFIER}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Version:</span>
              <strong className="text-[#163A70]">v1.2.0 (Driver Application)</strong>
            </div>
          </div>
          <p className="text-[#64748B] leading-relaxed text-[11px]">
            PARKit connects private parking spaces with drivers using automated computer vision telemetry. Designed with an intuitive Ola/Uber-inspired user flow.
          </p>
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAboutModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

