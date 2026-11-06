import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { User, Phone, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { LOGO_PATH } from '../../utils/constants';

export default function DriverProfileOnboarding() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  // If user already had a real name entered, use it; avoid default email numbers like "766"
  const initialName = user?.name && !/^\d+$/.test(user.name) && user.name !== 'Driver' ? user.name : '';
  const initialPhone = user?.phone && user.phone !== '+91 98000 00000' ? user.phone : '';

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name as shown on your driving license.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter a valid mobile number for parking SMS updates.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      updateProfile({
        name: name.trim(),
        phone: phone.trim(),
      });
      // Proceed to the vehicle setup onboarding step
      navigate('/onboarding/vehicle', { replace: true });
    } catch (err) {
      setError('Failed to update driver profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full space-y-6">
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
            <span>Step 2 of 3: Driver Details</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-sm space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              Tell us your name
            </h2>
            <p className="text-xs text-[#64748B]">
              Enter your real name and mobile number. This will be printed on your digital gate passes and parking receipts.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Driver Full Name"
              name="name"
              type="text"
              placeholder="e.g. Anusha Rao"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              icon={User}
              required
            />

            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              placeholder="e.g. +91 98450 12345"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError('');
              }}
              icon={Phone}
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[#163A70]">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={user?.email || 'driver@parkit.in'}
                  readOnly
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-[#F1F5F9] border border-[#CBD5E1] text-[#64748B] cursor-not-allowed"
                />
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
                <span>Continue to Vehicle Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-center gap-1.5 text-[11px] text-[#64748B]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Your driver identity is securely verified for automated bay entry.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

