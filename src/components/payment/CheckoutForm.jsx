import { useState } from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import { CreditCard, ExternalLink, ShieldCheck, QrCode, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function CheckoutForm({
  location,
  vehicles = [],
  onSubmitCheckout,
  loading = false,
}) {
  const [selectedPlate, setSelectedPlate] = useState(vehicles[0]?.plate || '');
  const [duration, setDuration] = useState('2');
  const [paymentMethod, setPaymentMethod] = useState('Stripe Test Checkout');

  const durationOptions = [
    { value: '1', label: '1 Hour' },
    { value: '2', label: '2 Hours' },
    { value: '3', label: '3 Hours' },
    { value: '4', label: '4 Hours' },
    { value: '8', label: 'Full Day (8 Hours)' },
  ];

  const vehicleOptions = vehicles.map(v => ({
    value: v.plate,
    label: `${v.plate} – ${v.brand} ${v.model}`,
  }));

  // Supported Indian & Stripe Test payment methods
  const paymentOptions = [
    { value: 'Stripe Test Checkout', label: '★ Stripe Checkout (TEST MODE: Cards & UPI)' },
    { value: 'UPI', label: '1. UPI (Instant QR / VPA)' },
    { value: 'Google Pay', label: '2. Google Pay (GPay)' },
    { value: 'PhonePe', label: '3. PhonePe' },
    { value: 'Paytm', label: '4. Paytm UPI & Wallet' },
    { value: 'Other UPI Apps', label: '5. Other Supported UPI Apps (BHIM / Cred)' },
    { value: 'Debit/Credit Card', label: '6. Debit / Credit Card (RuPay, Visa, Mastercard)' },
    { value: 'Net Banking', label: '7. Net Banking (SBI, HDFC, ICICI, Canara)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitCheckout({
      locationId: location?.id,
      vehiclePlate: selectedPlate || 'KA09XX0000',
      durationHours: parseInt(duration, 10),
      hourlyRate: location?.hourlyRate || 30.00,
      paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-xs space-y-4">
      <h4 className="text-base font-extrabold text-[#163A70] pb-2 border-b border-[#E2E8F0] flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-[#2563EB]" />
        Session Booking &amp; Payment
      </h4>

      {/* Vehicle Selector */}
      {vehicles.length > 0 ? (
        <Select
          label="Select Your Registered Vehicle"
          value={selectedPlate || vehicles[0].plate}
          onChange={(e) => setSelectedPlate(e.target.value)}
          options={vehicleOptions}
          required
        />
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
          <span className="font-bold block">No registered vehicle selected</span>
          <p className="text-[11px]">
            You can enter your plate at checkout or save vehicles in <strong>My Vehicles</strong>.
          </p>
        </div>
      )}

      {/* Duration Selector */}
      <Select
        label="Estimated Parking Duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        options={durationOptions}
      />

      {/* Indian Payment Method Selector */}
      <Select
        label="Select Payment Method"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
        options={paymentOptions}
      />

      {/* Integrity Notice */}
      <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#163A70] space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
          <span>Payment &amp; Availability Standard</span>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          Payment covers parking session tariff in Indian Rupees (₹). Parking spaces are not physically reserved or locked upon checkout.
        </p>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={loading}
        className="w-full font-bold shadow-md shadow-blue-500/20"
      >
        <span>Proceed to Pay with {paymentMethod}</span>
        <ExternalLink className="w-4 h-4 ml-1" />
      </Button>
    </form>
  );
}
