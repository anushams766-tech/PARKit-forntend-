import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import DemoProfileSelectorModal from './DemoProfileSelectorModal';
import { Sparkles, RotateCcw, Users, Car, CheckCircle2 } from 'lucide-react';

export default function DemoDataBar({ className = '' }) {
  const { isSampleMode, sampleProfile, resetSampleMode } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {!isSampleMode ? (
        <div
          className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#163A70] flex items-center gap-1.5">
                <span>Want to test PARKit with sample Mysore records?</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-[#2563EB] text-white">
                  5 PROFILES
                </span>
              </h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Load Anusha, Vismaya, Vaishakh, Tarun, or Deepak to preview vehicles, parking hubs, and INR payments.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Load Demo Data</span>
          </Button>
        </div>
      ) : (
        <div
          className={`bg-amber-50 border border-amber-300 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-white uppercase tracking-wider shrink-0">
              DEMO
            </span>
            <div className="min-w-0">
              <p className="text-xs text-amber-950 font-bold flex items-center gap-1.5 truncate">
                <span>Active Profile:</span>
                <strong className="text-[#163A70]">{sampleProfile?.name}</strong>
                <span className="text-[11px] font-normal text-amber-800 hidden sm:inline">
                  ({sampleProfile?.primaryVehicle} – {sampleProfile?.plate})
                </span>
              </p>
              <p className="text-[11px] text-amber-800">
                Sample vehicles, Mysore hubs, session history, and transaction receipts loaded.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-[#2563EB] hover:bg-blue-50 border border-blue-200 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Switch Profile</span>
            </button>

            <button
              type="button"
              onClick={resetSampleMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      )}

      {/* Selectable Profile Modal */}
      <DemoProfileSelectorModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

