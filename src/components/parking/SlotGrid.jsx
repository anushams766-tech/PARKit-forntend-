import { useState } from 'react';
import { Zap, Accessibility, Car } from 'lucide-react';
import { SLOT_STATUS } from '../../utils/constants';

export default function SlotGrid({ slots = [] }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Group slots by floor or surface
  const floors = [...new Set(slots.map(s => s.floor || 'Surface'))];

  const getSlotColor = (status) => {
    switch (status) {
      case SLOT_STATUS.EMPTY:
        return 'bg-emerald-50 border-emerald-500 text-emerald-800 hover:bg-emerald-100';
      case SLOT_STATUS.OCCUPIED:
        return 'bg-rose-50 border-rose-500 text-rose-800 hover:bg-rose-100';
      case SLOT_STATUS.UNCERTAIN:
      default:
        return 'bg-amber-50 border-amber-500 text-amber-800 hover:bg-amber-100';
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-5">
      {/* Header and Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h4 className="text-xs font-extrabold text-[#163A70] uppercase tracking-wider">
            Parking Bay Visual Layout (Mysore)
          </h4>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time occupancy detected via overhead computer vision camera.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-600 border border-white" />
            <span className="text-[#172554] font-bold">Empty (Available)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-600 border border-white" />
            <span className="text-[#172554] font-bold">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 border border-white" />
            <span className="text-[#172554] font-bold">Uncertain</span>
          </div>
        </div>
      </div>

      {/* Floors / Layout Grid */}
      {floors.map((floor) => {
        const floorSlots = slots.filter(s => (s.floor || 'Surface') === floor);
        return (
          <div key={floor} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                {floor}
              </span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {floorSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`relative p-3 rounded-xl border-2 flex flex-col items-center justify-between gap-2 transition-all duration-150 cursor-pointer min-h-[90px] ${getSlotColor(slot.status)} ${
                      isSelected ? 'ring-2 ring-[#2563EB] scale-105 shadow-md' : 'shadow-2xs'
                    }`}
                  >
                    {/* Slot Type Icon */}
                    <div className="self-end">
                      {slot.type === 'ev' ? (
                        <Zap className="w-3.5 h-3.5 text-amber-600" title="EV Charging Bay" />
                      ) : slot.type === 'accessible' ? (
                        <Accessibility className="w-3.5 h-3.5 text-blue-600" title="Accessible Bay" />
                      ) : (
                        <Car className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </div>

                    {/* Slot Code */}
                    <span className="text-base font-extrabold tracking-tight font-mono">
                      {slot.number}
                    </span>

                    {/* Status Pill */}
                    <span className="text-[10px] font-extrabold uppercase tracking-wider">
                      {slot.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Selected Slot Information Drawer */}
      {selectedSlot && (
        <div className="mt-4 p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2 animate-fade-in text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B]">Inspecting Bay:</span>
              <strong className="text-sm font-mono text-[#163A70]">
                Slot #{selectedSlot.number} ({selectedSlot.floor})
              </strong>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSlot(null)}
              className="text-xs text-[#64748B] hover:text-[#172554]"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div>
              <span className="text-[#64748B]">Category: </span>
              <strong className="capitalize text-[#172554]">{selectedSlot.type || 'Standard'}</strong>
            </div>
            <div>
              <span className="text-[#64748B]">Status: </span>
              <strong className="capitalize text-[#172554]">{selectedSlot.status}</strong>
            </div>
            <div>
              <span className="text-[#64748B]">Camera Accuracy: </span>
              <strong className="text-emerald-700">96.8% verified</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
