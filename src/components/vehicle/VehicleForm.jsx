
import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { isValidLicensePlate } from '../../utils/validators';
import { useAuth } from '../../context/AuthContext';

export default function VehicleForm({
  isOpen,
  onClose,
  onSubmit,
  vehicleToEdit,
  loading = false,
}) {
  const { user } = useAuth();
  const defaultDriverName = user?.name || 'Driver';

  const [formData, setFormData] = useState({
    driverName: defaultDriverName,
    plate: '',
    brand: '',
    model: '',
    color: '',
    type: 'Hatchback',
    nickname: '',
    visual: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        driverName: vehicleToEdit.driverName || defaultDriverName,
        plate: vehicleToEdit.plate || '',
        brand: vehicleToEdit.brand || '',
        model: vehicleToEdit.model || '',
        color: vehicleToEdit.color || '',
        type: vehicleToEdit.type || 'Hatchback',
        nickname: vehicleToEdit.nickname || '',
        visual: vehicleToEdit.visual || '',
      });
    } else {
      setFormData({
        driverName: defaultDriverName,
        plate: '',
        brand: '',
        model: '',
        color: '',
        type: 'Hatchback',
        nickname: '',
        visual: '',
      });
    }
    setErrors({});
  }, [vehicleToEdit, isOpen, defaultDriverName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'plate' ? value.toUpperCase().replace(/\s+/g, '') : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'Registration number is required (e.g. KA09MN4821)';
    } else if (!isValidLicensePlate(formData.plate)) {
      newErrors.plate = 'Please enter a valid vehicle registration number';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Manufacturer/Brand is required';
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  const vehicleTypes = [
    { value: 'Hatchback', label: 'Hatchback' },
    { value: 'Sedan', label: 'Sedan' },
    { value: 'Compact SUV', label: 'Compact SUV' },
    { value: 'Full-Size SUV', label: 'Full-Size SUV' },
    { value: 'Touring MUV', label: 'Touring MUV' },
    { value: 'Electric (EV)', label: 'Electric (EV)' },
    { value: 'Luxury Sedan', label: 'Luxury Sedan' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={vehicleToEdit ? 'Edit Vehicle Record' : 'Register Vehicle in Mysore'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Assigned Driver Name"
            name="driverName"
            placeholder="e.g. Anusha, Tarun"
            value={formData.driverName}
            onChange={handleChange}
            required
          />

          <Input
            label="Registration Number"
            name="plate"
            placeholder="e.g. KA09MN4821"
            value={formData.plate}
            onChange={handleChange}
            error={errors.plate}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Manufacturer / Brand"
            name="brand"
            placeholder="e.g. Maruti Suzuki, Toyota, BMW"
            value={formData.brand}
            onChange={handleChange}
            error={errors.brand}
            required
          />

          <Input
            label="Model Name"
            name="model"
            placeholder="e.g. Swift, Fortuner, Innova"
            value={formData.model}
            onChange={handleChange}
            error={errors.model}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Vehicle Category"
            name="type"
            value={formData.type}
            onChange={handleChange}
            options={vehicleTypes}
          />

          <Input
            label="Exterior Color"
            name="color"
            placeholder="e.g. Fire Red, Pearl White"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Vehicle Nickname (Optional)"
          name="nickname"
          placeholder="e.g. Mysore City Cruiser"
          value={formData.nickname}
          onChange={handleChange}
        />

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            {vehicleToEdit ? 'Save Changes' : 'Register Vehicle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
