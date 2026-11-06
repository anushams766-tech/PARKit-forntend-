import { useState } from 'react';
import AppearanceSettings from './AppearanceSettings';
import NotificationSettings from './NotificationSettings';
import PrivacySettings from './PrivacySettings';
import { useAuth, FIVE_DEMO_DRIVERS } from '../../context/AuthContext';
import { Palette, Bell, Shield, Info, Database, RotateCcw, CheckCircle2, User, Car } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, APP_IDENTIFIER } from '../../utils/constants';
import Button from '../../components/common/Button';

export default function Settings() {
  const { user, isSampleMode, sampleProfile, loadSampleProfile, resetSampleMode } = useAuth();
  const [activeTab, setActiveTab] = useState('appearance');
  const [selectedDemoId, setSelectedDemoId] = useState(FIVE_DEMO_DRIVERS[0].id);
  const [sampleLoadedNotice, setSampleLoadedNotice] = useState(false);

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Security & Privacy', icon: Shield },
    { id: 'sample', label: 'Load Sample Data', icon: Database },
    { id: 'info', label: 'About PARKit', icon: Info },
  ];

  const handleConfirmSampleData = () => {
    loadSampleProfile(selectedDemoId);
    setSampleLoadedNotice(true);
    setTimeout(() => setSampleLoadedNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
            Application Settings
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            DRIVER PREFERENCES
          </span>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure interface presentation, notifications, and prototype testing preferences.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Settings Navigation Tabs */}
        <div className="w-full md:w-56 shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-2 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#163A70] hover:bg-[#EFF6FF]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6">
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}

          {/* Requirement 13: Manual Load Sample Data Section */}
          {activeTab === 'sample' && (
            <div className="space-y-5 text-xs">
              <div>
                <h3 className="text-base font-extrabold text-[#163A70]">
                  Prototype Testing &amp; Sample Data
                </h3>
                <p className="text-[#64748B] mt-0.5">
                  The default PARKit experience is clean and empty for real production data. You can optionally load one of five fictional demo profiles for testing.
                </p>
              </div>

              {/* Status Alert */}
              {isSampleMode ? (
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#2563EB] animate-pulse" />
                    <div>
                      <strong className="text-[#163A70] block">Sample Mode Active</strong>
                      <span className="text-[#64748B] text-[11px]">
                        Currently loaded: <strong>{sampleProfile?.name}</strong> ({sampleProfile?.primaryVehicle} - {sampleProfile?.plate})
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={resetSampleMode}
                  >
                    Reset Clean Mode
                  </Button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[#64748B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clean Application Mode Active (No sample data loaded)</span>
                </div>
              )}

              {sampleLoadedNotice && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sample profile loaded! Map and vehicle records are now populated.</span>
                </div>
              )}

              {/* 5 Selectable Demo Profiles */}
              <div className="space-y-2 pt-2">
                <label className="block font-bold text-[#163A70] text-xs">
                  Select Exactly One Sample Profile to Load:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {FIVE_DEMO_DRIVERS.map((d) => {
                    const isSelected = selectedDemoId === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDemoId(d.id)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-[#2563EB] bg-[#EFF6FF]'
                            : 'border-[#E2E8F0] hover:border-[#CBD5E1] bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-10 h-10 rounded-full object-cover border border-[#2563EB]"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-sm text-[#163A70]">{d.name}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#2563EB] border border-[#BFDBFE]">
                                {d.vehicleType}
                              </span>
                            </div>
                            <span className="text-xs text-[#64748B] block mt-0.5">
                              {d.primaryVehicle} • <strong className="font-mono text-[#163A70]">{d.plate}</strong>
                            </span>
                          </div>
                        </div>

                        <input
                          type="radio"
                          name="selectedDemo"
                          checked={isSelected}
                          onChange={() => setSelectedDemoId(d.id)}
                          className="w-4 h-4 text-[#2563EB] focus:ring-[#2563EB]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-[#E2E8F0]">
                {isSampleMode && (
                  <button
                    type="button"
                    onClick={resetSampleMode}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Restore Clean Mode
                  </button>
                )}
                <div className="ml-auto">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleConfirmSampleData}
                  >
                    Confirm &amp; Load Sample Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div>
                <h3 className="text-base font-extrabold text-[#163A70]">
                  Application Information
                </h3>
                <p className="text-[#64748B] mt-0.5">
                  Build and platform architecture specifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Application Name:</span>
                  <strong className="text-[#163A70] font-extrabold">{APP_NAME}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Official Tagline:</span>
                  <strong className="text-[#172554]">{APP_TAGLINE}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">App Identifier:</span>
                  <strong className="font-mono text-[#2563EB]">{APP_IDENTIFIER}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Operating City:</span>
                  <strong className="text-[#172554]">Mysore (Mysuru), Karnataka, India</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Currency:</span>
                  <strong className="text-[#2563EB] font-extrabold">Indian Rupee (INR – ₹)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Backend Ingestion:</span>
                  <strong className="text-[#2563EB]">FastAPI + OpenCV / YOLO Vision Ready</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">PWA Capability:</span>
                  <strong className="text-emerald-700 font-bold">Installable PWA Ready</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[11px] text-[#64748B] leading-relaxed space-y-1">
                <h5 className="font-extrabold text-[#163A70]">Transparency &amp; Disclaimers</h5>
                <p>
                  PARKit is an automated parking bay occupancy detection platform. Real-time vision inferences are verified from overhead cameras across registered locations in Mysore. Sample testing profiles and fictional vehicle plates are isolated from live production data.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
