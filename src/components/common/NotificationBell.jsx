import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, Camera, AlertCircle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="relative p-2 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors border border-[#E2E8F0] cursor-pointer"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl p-4 z-50 text-[#172554] animate-scale-in">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-3">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#163A70]">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="p-1 rounded text-xs text-[#64748B] hover:text-[#2563EB] flex items-center gap-1"
                  title="Mark all as read"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="p-1 rounded text-xs text-rose-500 hover:text-rose-600"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">
                No notifications right now.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl border text-xs transition-colors flex items-start gap-2.5 ${
                    n.read
                      ? 'bg-white border-[#E2E8F0] text-[#64748B]'
                      : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#172554]'
                  }`}
                >
                  <div className="mt-0.5 text-[#2563EB]">
                    {n.type === 'warning' ? (
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Camera className="w-4 h-4 text-[#2563EB]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#163A70]">{n.title}</p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-[#94A3B8] mt-1 block">
                      {n.time}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
