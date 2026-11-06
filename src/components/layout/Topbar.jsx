import { useState } from 'react';
import { Menu, MapPin, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../common/NotificationBell';
import ProfileDrawer from '../profile/ProfileDrawer';
import Modal from '../common/Modal';
import CascadingLocationPicker from '../common/CascadingLocationPicker';
import Button from '../common/Button';
import { LOGO_PATH } from '../../utils/constants';

export default function Topbar({ onToggleSidebar }) {
  const { user, currentLocation, updateLocation } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState(currentLocation);

  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateLocation(tempLocation);
    setIsLocationModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 py-2.5 shadow-xs transition-colors">
        <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
          {/* Left: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-2 -ml-1 rounded-xl text-[#163A70] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#CBD5E1] p-0.5 overflow-hidden flex items-center justify-center shrink-0">
                <img
                  src={LOGO_PATH}
                  alt="PARKit"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-extrabold text-base tracking-tight text-[#163A70] hidden xs:inline">
                PARKit
              </span>
            </div>
          </div>

          {/* Center / Location Selector Pill (Ola/Uber style) */}
          <button
            type="button"
            onClick={() => {
              setTempLocation(currentLocation);
              setIsLocationModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#CBD5E1] hover:border-[#2563EB] transition-colors cursor-pointer max-w-[200px] sm:max-w-xs text-left"
            title="Click to change location"
          >
            <div className="p-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="truncate">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block leading-none">
                Parking near you
              </span>
              <span className="text-xs font-bold text-[#163A70] truncate block mt-0.5">
                {currentLocation?.locality ? `${currentLocation.locality}, ` : ''}{currentLocation?.district || 'Mysore'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] shrink-0 hidden sm:inline" />
          </button>

          {/* Right: Notifications & Profile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NotificationBell />

            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-2 p-1 rounded-xl bg-white hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-colors cursor-pointer"
              title="Open driver profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#2563EB]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs flex items-center justify-center border border-[#BFDBFE]">
                  {user?.name?.charAt(0) || 'D'}
                </div>
              )}
              <span className="hidden md:inline text-xs font-bold text-[#172554] max-w-[100px] truncate pr-1">
                {user?.name || 'Profile'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Ola/Uber Style Profile Drawer */}
      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Change Location Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Select Location (City &amp; Locality)"
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
    </>
  );
}
