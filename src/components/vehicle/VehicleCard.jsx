import { Car, Zap, Edit2, Trash2, CheckCircle2, User } from 'lucide-react';

export default function VehicleCard({
  vehicle,
  onEdit,
  onDelete,
  onSetPrimary,
}) {
  if (!vehicle) return null;

  const isEV = vehicle.type?.toLowerCase().includes('ev') || vehicle.type?.toLowerCase().includes('electric');

  return (
    <div className={`bg-white p-5 rounded-2xl border transition-all flex flex-col justify-between ${
      vehicle.isPrimary
        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/15 shadow-md'
        : 'border-[#E2E8F0] hover:border-[#2563EB]/60 shadow-xs'
    }`}>
      <div>
        {/* Top Tag & Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              {vehicle.type || 'Standard'}
            </span>
            {(vehicle.source === 'DEMO' || vehicle.source === 'DEMO DATA') && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-300">
                DEMO
              </span>
            )}
            {vehicle.driverName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#163A70]">
                <User className="w-3 h-3 text-[#2563EB]" />
                {vehicle.driverName}
              </span>
            )}
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(vehicle)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#EFF6FF] transition-colors"
                title="Edit vehicle"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(vehicle)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete vehicle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Image Thumbnail & Titles */}
        <div className="flex items-center gap-3 mb-3">
          {vehicle.visual ? (
            <img
              src={vehicle.visual}
              alt={vehicle.model}
              className="w-16 h-12 object-cover rounded-xl border border-[#CBD5E1] shadow-xs"
            />
          ) : (
            <div className="w-16 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center">
              <Car className="w-6 h-6" />
            </div>
          )}

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] block">
              {vehicle.brand}
            </span>
            <h4 className="font-extrabold text-sm text-[#163A70]">
              {vehicle.model}
            </h4>
            <span className="text-[11px] text-[#64748B] block mt-0.5">
              {vehicle.color || 'Standard Color'}
            </span>
          </div>
        </div>

        {/* License Plate Display (Karnataka Standard Plate) */}
        <div className="my-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] flex items-center justify-between">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-extrabold block">
              Registration Number
            </span>
            <span className="text-xl font-extrabold font-mono tracking-wider text-[#163A70]">
              {vehicle.plate}
            </span>
          </div>

          <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
            IND
          </span>
        </div>
      </div>

      {/* Nickname & Primary Badge */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E2E8F0] text-xs">
        <span className="text-[#64748B] italic">
          {vehicle.nickname ? `"${vehicle.nickname}"` : 'No nickname'}
        </span>

        {vehicle.isPrimary ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Default Vehicle
          </span>
        ) : onSetPrimary ? (
          <button
            type="button"
            onClick={() => onSetPrimary(vehicle.id)}
            className="text-[11px] text-[#2563EB] hover:underline font-bold cursor-pointer"
          >
            Set as Default
          </button>
        ) : null}
      </div>
    </div>
  );
}
