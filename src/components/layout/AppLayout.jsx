import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../../context/AuthContext';
import { RotateCcw } from 'lucide-react';

export default function AppLayout() {
  const { isSampleMode, sampleProfile, resetSampleMode } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#172554] transition-colors">
      {/* Sidebar Navigation Only (slide-out on mobile, compact/collapsible on desktop) */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isCollapsed={desktopCollapsed}
        onToggleCollapse={() => setDesktopCollapsed(!desktopCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Non-intrusive Sample Mode Banner (shown ONLY when sample data mode is active) */}
        {isSampleMode && (
          <div className="bg-[#EFF6FF] border-b border-[#BFDBFE] px-4 py-1.5 flex items-center justify-between text-xs text-[#163A70]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span>
                Prototype Sample Mode: <strong>{sampleProfile?.name}</strong> ({sampleProfile?.primaryVehicle})
              </span>
            </div>
            <button
              type="button"
              onClick={resetSampleMode}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
              title="Reset to clean mode"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Clean Mode</span>
            </button>
          </div>
        )}

        {/* Global Topbar */}
        <Topbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Main Content Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-5 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
