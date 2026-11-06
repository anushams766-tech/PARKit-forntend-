import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import { Sun, Moon, Laptop, Check, RotateCcw, Sparkles } from 'lucide-react';

export default function AppearanceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { addToast } = useNotification();

  // Local staged selection
  const [stagedTheme, setStagedTheme] = useState(theme);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setStagedTheme(theme);
  }, [theme]);

  const themes = [
    {
      id: 'light',
      label: 'Light Mode',
      badge: 'Brand Standard',
      description: 'Crisp white cards, light-blue (#EFF6FF) surfaces, and #2563EB primary blue highlights. Optimized for daylight driving.',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Dark / Night Mode',
      badge: 'Night Mode',
      description: 'Deep navy and dark contrast surfaces (#0B1528) for nighttime driving comfort with blue and white telemetry badges.',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'System Default',
      badge: 'Automatic',
      description: 'Automatically synchronizes with your device operating system display preferences (Light/Dark).',
      icon: Laptop,
    },
  ];

  const handleSelect = (selectedId) => {
    setStagedTheme(selectedId);
    // Apply immediately to DOM for instant preview
    setTheme(selectedId);
    setIsSaved(false);
  };

  const handleApplySave = () => {
    setTheme(stagedTheme);
    localStorage.setItem('parkit_theme', stagedTheme);
    setIsSaved(true);
    addToast(`${stagedTheme.charAt(0).toUpperCase() + stagedTheme.slice(1)} theme applied and persisted!`, 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancelReset = () => {
    const saved = localStorage.getItem('parkit_theme') || 'light';
    setStagedTheme(saved);
    setTheme(saved);
    addToast('Reverted to previously saved theme', 'info');
  };

  const hasUnsavedChanges = stagedTheme !== (localStorage.getItem('parkit_theme') || 'light');

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h3 className="text-base font-extrabold text-[#163A70]">
          Interface Theme &amp; Presentation
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Choose your visual presentation. Changes apply immediately throughout the entire application.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {themes.map((t) => {
          const Icon = t.icon;
          const isSelected = stagedTheme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#2563EB] bg-[#EFF6FF] ring-2 ring-[#2563EB]/20 shadow-md'
                  : 'border-[#CBD5E1] bg-white hover:border-[#2563EB]/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <span className="p-1 rounded-full bg-[#2563EB] text-white">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#163A70]">{t.label}</h4>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#2563EB]">
                    {t.badge}
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1 leading-snug">
                  {t.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation & Status Bar */}
      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#64748B]">
          <span>Active Display Mode:</span>
          <strong className="text-[#2563EB] font-mono uppercase font-extrabold">
            {resolvedTheme} theme rendered ({stagedTheme})
          </strong>
        </div>

        {/* Explicit Save/Apply and Cancel/Reset Action Buttons (Requirement 5) */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCancelReset}
            disabled={!hasUnsavedChanges}
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Cancel / Reset</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleApplySave}
            className="flex items-center gap-1.5 shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply &amp; Save Theme</span>
          </Button>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Theme successfully applied and saved for future sessions!</span>
        </div>
      )}
    </div>
  );
}
