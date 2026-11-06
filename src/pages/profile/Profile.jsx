import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import CascadingLocationPicker from '../../components/common/CascadingLocationPicker';
import {
  User,
  Mail,
  Phone,
  Car,
  Edit2,
  LogOut,
  MapPin,
  Camera,
  CreditCard,
  Clock,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { DEFAULT_USER_LOCATION } from '../../utils/locationData';

export default function Profile() {
  const { user, currentLocation, updateProfile, updateLocation, logout, isSampleMode, sampleProfile } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [tempLocation, setTempLocation] = useState(currentLocation);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ avatar: reader.result });
        addToast('Profile photograph updated', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    addToast('Profile updated successfully', 'success');
  };

  const handleSaveLocation = (e) => {
    e.preventDefault();
    updateLocation(tempLocation);
    setIsLocationModalOpen(false);
    addToast('Operating location updated', 'success');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative group">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-[#2563EB] shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-[#EFF6FF] text-[#2563EB] text-2xl font-extrabold flex items-center justify-center border border-[#BFDBFE]">
                {user?.name?.charAt(0) || 'D'}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-[#2563EB] text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              title="Upload profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
                {user?.name || 'Driver User'}
              </h2>
              {isSampleMode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                  SAMPLE DRIVER ({sampleProfile?.name})
                </span>
              )}
            </div>

            <p className="text-xs text-[#64748B] flex items-center justify-center sm:justify-start gap-1">
              <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-[#64748B] flex items-center justify-center sm:justify-start gap-1">
              <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{user?.phone || '+91 98450 00000'}</span>
            </p>
            <p className="text-xs text-[#2563EB] font-bold flex items-center justify-center sm:justify-start gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>
                {currentLocation?.locality ? `${currentLocation.locality}, ` : ''}{currentLocation?.district || 'Mysore'}, {currentLocation?.state || 'Karnataka'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Edit2}
              onClick={() => {
                setFormData({
                  name: user?.name || '',
                  phone: user?.phone || '',
                  email: user?.email || '',
                });
                setIsEditing(true);
              }}
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Quick Menu Options (Ola/Uber inspired) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => navigate('/vehicles')}
            className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-[#2563EB] border border-[#CBD5E1]">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#163A70]">My Vehicles</h4>
                <p className="text-[11px] text-[#64748B]">Manage registered license plates</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
          </button>

          <button
            type="button"
            onClick={() => {
              setTempLocation(currentLocation);
              setIsLocationModalOpen(true);
            }}
            className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-[#2563EB] border border-[#CBD5E1]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#163A70]">Saved Location</h4>
                <p className="text-[11px] text-[#64748B]">Change city or district</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/parking-history')}
            className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-[#2563EB] border border-[#CBD5E1]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#163A70]">Parking History</h4>
                <p className="text-[11px] text-[#64748B]">Past sessions and receipts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/payments')}
            className="p-3.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#E2E8F0] hover:border-[#2563EB] transition-all cursor-pointer flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white text-[#2563EB] border border-[#CBD5E1]">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#163A70]">Payment Records</h4>
                <p className="text-[11px] text-[#64748B]">Verified transaction logs</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1]" />
          </button>
        </div>

        {/* Footer Logout Action */}
        <div className="pt-2 flex justify-between items-center border-t border-[#E2E8F0]">
          <span className="text-xs text-[#64748B]">
            Driver session: <strong>{user?.name}</strong>
          </span>

          <Button
            variant="danger"
            size="sm"
            icon={LogOut}
            onClick={logout}
          >
            Log Out of PARKit
          </Button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="Edit Driver Profile"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Driver Name"
            required
          />

          <Input
            label="Mobile Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98450 00000"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="driver@example.com"
            required
          />

          <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Location Modal */}
      <Modal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        title="Select Operating Location"
      >
        <form onSubmit={handleSaveLocation} className="space-y-4 text-xs">
          <CascadingLocationPicker
            value={tempLocation}
            onChange={setTempLocation}
            includeLocality={true}
          />
          <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Location
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
