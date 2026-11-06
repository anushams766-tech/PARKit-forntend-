import { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import VehicleCard from '../../components/vehicle/VehicleCard';
import VehicleForm from '../../components/vehicle/VehicleForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import DemoDataBar from '../../components/common/DemoDataBar';
import { Car, Plus, Info } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

export default function Vehicles() {
  const { addToast } = useNotification();
  const { isSampleMode, sampleProfile } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await vehicleService.getUserVehicles();
      setVehicles(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [isSampleMode]);

  const handleCreateOrUpdate = async (formData) => {
    setActionLoading(true);
    try {
      if (vehicleToEdit) {
        await vehicleService.updateVehicle(vehicleToEdit.id, formData);
        addToast(`Vehicle ${formData.plate} updated successfully`, 'success');
      } else {
        await vehicleService.addVehicle(formData);
        addToast(`Vehicle ${formData.plate} registered successfully`, 'success');
      }
      setIsFormOpen(false);
      setVehicleToEdit(null);
      fetchVehicles();
    } catch (e) {
      addToast('Failed to save vehicle details', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!vehicleToDelete) return;
    setActionLoading(true);
    try {
      await vehicleService.deleteVehicle(vehicleToDelete.id);
      addToast(`Vehicle ${vehicleToDelete.plate} removed`, 'info');
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (e) {
      addToast('Failed to delete vehicle', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetPrimary = async (vehicleId) => {
    await vehicleService.setDefaultVehicle(vehicleId);
    const updated = vehicles.map(v => ({
      ...v,
      isPrimary: v.id === vehicleId,
    }));
    setVehicles(updated);
    addToast('Default vehicle updated', 'success');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Visible Demo Data Controls */}
      <DemoDataBar />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              My Vehicles
            </h2>
            {isSampleMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                Sample Vehicle ({sampleProfile?.name})
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage your registered vehicle license plates for camera-based automated parking detection.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setVehicleToEdit(null);
            setIsFormOpen(true);
          }}
        >
          Add Vehicle
        </Button>
      </div>

      {loading ? (
        <Loader text="Loading your saved vehicles..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={Car}
          title="No vehicles registered yet"
          description="Add your first vehicle license plate to enable fast checkout and automated camera recognition."
          actionLabel="Register Vehicle"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((veh) => (
            <VehicleCard
              key={veh.id}
              vehicle={veh}
              onEdit={(v) => {
                setVehicleToEdit(v);
                setIsFormOpen(true);
              }}
              onDelete={(v) => setVehicleToDelete(v)}
              onSetPrimary={handleSetPrimary}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setVehicleToEdit(null);
        }}
        onSubmit={handleCreateOrUpdate}
        vehicleToEdit={vehicleToEdit}
        loading={actionLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!vehicleToDelete}
        onClose={() => setVehicleToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Saved Vehicle?"
        message={`Are you sure you want to remove ${vehicleToDelete?.plate} (${vehicleToDelete?.brand} ${vehicleToDelete?.model}) from your account?`}
        confirmLabel="Remove Vehicle"
        isDanger={true}
      />
    </div>
  );
}
