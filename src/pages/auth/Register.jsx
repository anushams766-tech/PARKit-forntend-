import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CascadingLocationPicker from '../../components/common/CascadingLocationPicker';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { LOGO_PATH, APP_TAGLINE } from '../../utils/constants';
import { DEFAULT_USER_LOCATION } from '../../utils/locationData';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: DEFAULT_USER_LOCATION,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (loc) => {
    setFormData(prev => ({ ...prev, location: loc }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      });
      // Proceed to location permission
      navigate('/location-permission', { replace: true });
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-xl w-full space-y-6">
        {/* PARKit Logo Container */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 mx-auto flex items-center justify-center p-2 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
            <img
              src={LOGO_PATH}
              alt="PARKit Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#163A70]">
            Create Driver Account
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Register to discover parking spaces and manage sessions
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-md space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Full Name"
                name="name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
              />

              <Input
                label="Mobile Number"
                name="phone"
                type="tel"
                placeholder="+91 98450 00000"
                value={formData.phone}
                onChange={handleChange}
                icon={Phone}
                required
              />
            </div>

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. ramesh@example.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                icon={Lock}
                required
              />
            </div>

            {/* Cascading Location: Country → State → District → Locality (optional) */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <CascadingLocationPicker
                value={formData.location}
                onChange={handleLocationChange}
                includeLocality={true}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md shadow-blue-500/20 mt-2"
            >
              Register &amp; Continue
            </Button>
          </form>
        </div>

        {/* Back to Login */}
        <p className="text-center text-xs text-[#64748B]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563EB] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
