import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export default function PrivacySettings() {
  const { addToast } = useNotification();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New passwords do not match', 'error');
      return;
    }
    addToast('Password updated in demo session', 'success');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-extrabold text-[#163A70]">
          Security &amp; Account Privacy
        </h3>
        <p className="text-xs text-[#64748B] mt-0.5">
          Manage driver credentials and view camera vision data privacy protections.
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <h4 className="font-extrabold text-xs text-[#163A70] uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#2563EB]" />
          Change Password
        </h4>

        <Input
          label="Current Password"
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <div className="flex justify-end pt-1">
          <Button type="submit" variant="primary" size="sm">
            Update Password
          </Button>
        </div>
      </form>

      {/* Privacy Standards Card */}
      <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-2 text-xs">
        <div className="flex items-center gap-2 text-[#2563EB] font-extrabold">
          <ShieldCheck className="w-4 h-4" />
          <span>PARKit Data Privacy Guarantee</span>
        </div>
        <p className="text-[#64748B] leading-relaxed">
          Overhead computer vision feeds strictly compute slot occupancy coordinates. Raw video streams are processed on edge or ephemeral vision pipelines and are never retained with driver identity profiles. Payment card numbers are never stored on frontend instances.
        </p>
      </div>
    </div>
  );
}
