import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useAuth, FIVE_DEMO_DRIVERS } from '../../context/AuthContext';
import { User, Car, MapPin, Sparkles, Check, ShieldAlert } from 'lucide-react';

export default function DemoProfileSelectorModal({ isOpen, onClose }) {
  const { loadSampleProfile, isSampleMode, sampleProfile } = useAuth();
  const [selectedId, setSelectedId] = useState(
    sampleProfile?.id || FIVE_DEMO_DRIVERS[0].id
  );

  const handleSelectAndLoad = () => {
    loadSampleProfile(selectedId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Demo Driver Profile (Mysore)"
    >
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-[#163A70] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#2563EB]">
            <Sparkles className="w-4 h-4" />
            <span>Prototype Demonstration Mode</span>
          </div>
          <p className="text-[11px] text-[#64748B] leading-relaxed">
            Choose one of the five realistic Mysore driver profiles. Loading a profile will populate their verified vehicle, registered Mysore parking locations, parking session history, and transaction receipts.
          </p>
        </div>

        {/* 5 Selectable Profiles */}
        <div className="space-y-2.5">
          {FIVE_DEMO_DRIVERS.map((profile, index) => {
            const isSelected = selectedId === profile.id;
            return (
              <div
                key={profile.id}
                onClick={() => setSelectedId(profile.id)}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF] shadow-xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-10 h-10 rounded-xl object-cover border border-[#BFDBFE]"
                    />
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#163A70] text-white text-[10px] font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-extrabold text-sm text-[#163A70]">
                        {profile.name}
                      </h5>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white text-[#2563EB] border border-[#BFDBFE] uppercase tracking-wider">
                        DEMO
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#64748B] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Car className="w-3 h-3 text-[#2563EB]" />
                        <strong className="text-[#172554]">{profile.primaryVehicle}</strong>
                        <span className="font-mono text-[10px] text-[#2563EB]">({profile.plate})</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#64748B]" />
                        <span>{profile.location.locality}, Mysuru</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-[#CBD5E1]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] pt-1">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>All records are tagged as DEMO and remain separate from real backend accounts.</span>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSelectAndLoad}>
            Load Selected Profile
          </Button>
        </div>
      </div>
    </Modal>
  );
}

