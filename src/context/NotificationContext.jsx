import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 'notif_1',
      title: 'Camera Calibration Completed',
      message: 'Downtown Metro Hub Camera #2 recalibrated successfully.',
      time: '10m ago',
      read: false,
      type: 'info',
    },
    {
      id: 'notif_2',
      title: 'Parking Stale Warning',
      message: 'Bayside Plaza camera has not sent updates for >90s.',
      time: '25m ago',
      read: false,
      type: 'warning',
    },
    {
      id: 'notif_3',
      title: 'Receipt Available',
      message: 'Payment for 2h session at Westside Tech Park is confirmed.',
      time: '1h ago',
      read: true,
      type: 'success',
    },
  ]);

  const addToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        notifications,
        unreadCount,
        addToast,
        removeToast,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-xl border text-sm flex items-center justify-between gap-3 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-700/60 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-700/60 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 border-amber-700/60 text-amber-200'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-100'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-60 hover:opacity-100 ml-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

