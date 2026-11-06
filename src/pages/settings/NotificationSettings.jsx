import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import { Bell, Check, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

const NOTIF_SETTINGS_KEY = 'parkit_notification_settings';

const DEFAULT_SETTINGS = {
  parkingUpdates: true,
  cameraAlerts: true,
  paymentReceipts: true,
  staleDataWarnings: true,
};

export default function NotificationSettings() {
  const { addToast } = useNotification();

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(NOTIF_SETTINGS_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedNotice, setSavedNotice] = useState(false);

  const toggle = (key) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      // Auto-save changes to localStorage
      localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(next));
      return next;
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
    addToast('Notification preferences updated', 'info');
  };

  const handleSaveAll = () => {
    localStorage.setItem(NOTIF_SETTINGS_KEY, JSON.stringify(settings));
    setSavedNotice(true);
    addToast('Notification preferences saved successfully', 'success');
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const items = [
    {
      key: 'parkingUpdates',
      title: 'Parking Bay Availability Updates',
      desc: 'Receive alerts when nearby registered spots in Mysore change status to EMPTY.',
    },
    {
      key: 'cameraAlerts',
      title: 'Camera & Vision System Alerts',
      desc: 'Notify when a high-mounted camera feed status alters or detects occupancy transition.',
    },
    {
      key: 'paymentReceipts',
      title: 'Payment & Invoice Confirmations',
      desc: 'Instant notification on simulated UPI or Stripe Test Indian Rupee payment confirmation.',
    },
    {
      key: 'staleDataWarnings',
      title: 'Stale Data Freshness Warnings',
      desc: 'Show in-app warnings when camera feeds have not refreshed for >90 seconds.',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-extrabold text-[#163A70]">
            Notification Preferences
          </h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure which real-time event updates are surfaced in your topbar feed.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Preferences</span>
        </Button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Notification preferences successfully saved!</span>
        </div>
      )}

      <div className="space-y-3">
        {items.map((it) => (
          <div
            key={it.key}
            className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between gap-4 transition-colors"
          >
            <div>
              <h5 className="font-bold text-xs text-[#163A70]">{it.title}</h5>
              <p className="text-[11px] text-[#64748B] mt-0.5">{it.desc}</p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={settings[it.key]}
                onChange={() => toggle(it.key)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
