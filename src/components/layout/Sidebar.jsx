import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Car,
  Clock,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LOGO_PATH } from '../../utils/constants';

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) {
  const { user, currentLocation, logout } = useAuth();

  // Exactly the 8 options specified in Requirement 12
  const sidebarLinks = [
    { to: '/home', label: 'Home / Dashboard', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore Parking', icon: Compass },
    { to: '/vehicles', label: 'My Vehicles', icon: Car },
    { to: '/parking-history', label: 'Parking History', icon: Clock },
    { to: '/payments', label: 'Payments', icon: CreditCard },
    { to: '/settings', label: 'Settings', icon: Settings },
    { to: '/support', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 bg-white border-r border-[#E2E8F0] text-[#172554] flex flex-col justify-between transition-all duration-200 shadow-sm ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-[#CBD5E1] p-1 overflow-hidden shrink-0 shadow-xs">
                <img
                  src={LOGO_PATH}
                  alt="PARKit Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <h1 className="text-base font-extrabold tracking-tight text-[#163A70] leading-none truncate">
                    PARKit
                  </h1>
                  <p className="text-[10px] text-[#2563EB] font-bold tracking-wider uppercase mt-1 truncate">
                    Smart Parking
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#172554] hover:bg-[#F8FAFC] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden md:flex p-1 rounded-lg text-[#64748B] hover:text-[#163A70] hover:bg-[#EFF6FF] cursor-pointer"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Location Chip in Sidebar */}
          {!isCollapsed && (
            <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-2 text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              <div className="truncate">
                <span className="text-[9px] uppercase font-bold text-[#64748B] block leading-none">
                  Operating City
                </span>
                <span className="font-bold text-[#163A70] truncate text-[11px] block mt-0.5">
                  {currentLocation?.district || 'Mysore (Mysuru)'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/20'
                        : 'text-[#64748B] hover:text-[#172554] hover:bg-[#EFF6FF]'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`
                  }
                  title={isCollapsed ? link.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>{link.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer: Driver Details & Logout (Sidebar Option 8) */}
        <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
              isCollapsed ? 'justify-center px-2' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
