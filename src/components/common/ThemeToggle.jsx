import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      title={`Current: ${theme} (${resolvedTheme}). Click to switch.`}
      className={`relative inline-flex items-center gap-2 p-2 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors cursor-pointer border border-[#E2E8F0] ${className}`}
      aria-label="Toggle theme mode"
    >
      {theme === 'system' ? (
        <Laptop className="w-4 h-4 text-[#2563EB]" />
      ) : resolvedTheme === 'dark' ? (
        <Moon className="w-4 h-4 text-[#163A70]" />
      ) : (
        <Sun className="w-4 h-4 text-amber-500" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold capitalize">{theme}</span>
      )}
    </button>
  );
}
