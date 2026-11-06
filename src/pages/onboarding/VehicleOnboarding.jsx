import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import { Car, ShieldCheck, ArrowRight, Palette, Tag } from 'lucide-react';
import { LOGO_PATH } from '../../utils/constants';

export default function VehicleOnboarding() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    driverName: user?.name || 'Driver',
    plate: '',
    brand: '',
    model: '',
    type: 'Hatchback',
    color: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const vehicleCategories = [
    { value: 'Hatchback', label: 'Hatchback (e.g. Swift, i20)' },
    { value: 'Sedan', label: 'Sedan (e.g. City, Verna)' },
    { value: 'Compact SUV', label: 'Compact SUV (e.g. Brezza, Nexon)' },
    { value: 'Full-Size SUV', label: 'Full-Size SUV (e.g. Fortuner, XUV700)' },
    { value: 'Electric (EV)', label: 'Electric Vehicle / EV' },
    { value: 'Two-Wheeler / Bike', label: 'Two-Wheeler / Motorbike' },
    { value: 'Touring MUV', label: 'Touring MUV (e.g. Innova)' },
    { value: 'Luxury Sedan', label: 'Luxury Sedan (e.g. BMW, Audi, Mercedes)' },
  ];

  const colorOptions = [
    { value: 'Fire Red', label: 'Fire Red' },
    { value: 'Pearl White', label: 'Pearl White' },
    { value: 'Midnight Black', label: 'Midnight Black' },
    { value: 'Silver Metallic', label: 'Silver Metallic' },
    { value: 'Navy Blue', label: 'Navy Blue' },
    { value: 'Grey', label: 'Grey / Charcoal' },
    { value: 'Other', label: 'Other Colour' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'plate' ? value.toUpperCase().replace(/\s+/g, '') : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.plate.trim()) {
      newErrors.plate = 'Registration number is required (e.g. KA09MN4821)';
    } else if (formData.plate.trim().length < 4) {
      newErrors.plate = 'Please enter a valid registration number';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Manufacturer/Brand is required (e.g. Maruti Suzuki, Tata)';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Vehicle model is required (e.g. Swift, Nexon)';
    }

    if (!formData.color.trim()) {
      newErrors.color = 'Exterior colour is required for camera visual matching';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Register vehicle as primary
      await vehicleService.addVehicle({
        ...formData,
        isPrimary: true,
      });

      // Mark onboarding as completed in driver profile
      updateProfile({
        onboardingComplete: true,
        primaryVehicle: `${formData.brand} ${formData.model}`,
        plate: formData.plate,
        vehicleType: formData.type,
      });

      // Requirement 4: "Show Explore Parking only after the vehicle setup step, while allowing users to add more vehicles later."
      navigate('/explore', { replace: true });
    } catch (err) {
      setErrors({ form: 'Failed to register vehicle. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-lg w-full space-y-6">
        {/* PARKit Logo Container */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto flex items-center justify-center p-2 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs overflow-hidden">
            <img
              src={LOGO_PATH}
              alt="PARKit Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold border border-[#BFDBFE]">
            <span>Step 3 of 3: Primary Vehicle Setup</span>
          </div>
        </div>

        {/* Vehicle Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-sm space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              Register Your Vehicle
            </h2>
            <p className="text-xs text-[#64748B]">
              PARKit uses overhead computer-vision cameras to detect your vehicle number plate and automate gate check-in.
            </p>
          </div>

          {errors.form && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Driver Name (prefilled, editable) */}
            <Input
              label="Registered Driver Name"
              name="driverName"
              type="text"
              value={formData.driverName}
              onChange={handleChange}
              placeholder="e.g. Anusha Rao"
              required
            />

            {/* License Plate */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#163A70]">
                Vehicle Registration Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleChange}
                  placeholder="e.g. KA09MN4821"
                  className="w-full px-3.5 py-2.5 rounded-xl font-mono text-sm tracking-wider uppercase font-bold bg-white border border-[#CBD5E1] text-[#2563EB] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  required
                />
              </div>
              {errors.plate && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.plate}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Manufacturer / Brand */}
              <Input
                label="Manufacturer / Brand"
                name="brand"
                type="text"
                placeholder="e.g. Maruti Suzuki"
                value={formData.brand}
                onChange={handleChange}
                error={errors.brand}
                required
              />

              {/* Model */}
              <Input
                label="Vehicle Model"
                name="model"
                type="text"
                placeholder="e.g. Swift ZXi"
                value={formData.model}
                onChange={handleChange}
                error={errors.model}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Vehicle Category */}
              <Select
                label="Vehicle Category"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={vehicleCategories}
              />

              {/* Exterior Colour */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#163A70]">
                  Exterior Colour <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="color"
                    list="color-suggestions"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Fire Red, White"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    required
                  />
                  <datalist id="color-suggestions">
                    {colorOptions.map((c) => (
                      <option key={c.value} value={c.value} />
                    ))}
                  </datalist>
                </div>
                {errors.color && (
                  <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.color}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 text-sm shadow-sm"
              >
                <span>Save Vehicle &amp; Explore Parking</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="pt-3 border-t border-[#F1F5F9] text-center text-[11px] text-[#64748B]">
            <span>You can add and manage more vehicles anytime under <strong>My Vehicles</strong> in the menu.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

