import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { CreditCard, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function StripeTestModal({
  isOpen,
  onClose,
  amount,
  locationName,
  vehiclePlate,
  onCompletePayment,
  loading = false,
}) {
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [testMethod, setTestMethod] = useState('card_success'); // 'card_success' | 'card_fail' | 'upi_test'

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (testMethod === 'card_fail') {
      onCompletePayment({
        status: 'FAILED',
        error: 'Your card was declined. Please try another payment method (Stripe Test Error code: card_declined).',
        testMethod,
      });
    } else {
      onCompletePayment({
        status: 'COMPLETED',
        transactionId: 'STRIPE_TEST_' + Date.now().toString(36).toUpperCase(),
        paymentMethod: testMethod === 'upi_test' ? 'Stripe Test UPI (success@stripe)' : 'Stripe Test Card (•••• 4242)',
        testMethod,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Stripe Test Mode Checkout (INR)"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Test Mode Banner */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Stripe Checkout — TEST MODE ACTIVE</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            No real payments are charged. Secret keys remain securely on the backend server.
          </p>
        </div>

        {/* Order Details */}
        <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-1.5">
          <div className="flex justify-between">
            <span className="text-[#64748B]">Parking Hub:</span>
            <strong className="text-[#163A70]">{locationName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[#64748B]">Vehicle Plate:</span>
            <strong className="font-mono text-[#2563EB]">{vehiclePlate}</strong>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#E2E8F0]">
            <span className="text-[#163A70] font-bold">Total Payable (INR):</span>
            <strong className="text-[#2563EB] text-base font-extrabold">{formatCurrency(amount)}</strong>
          </div>
        </div>

        {/* Test Method Selection */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#163A70]">
            Select Stripe Test Scenario:
          </label>
          <div className="grid grid-cols-1 gap-2">
            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              testMethod === 'card_success' ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#CBD5E1] bg-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stripe_test"
                  checked={testMethod === 'card_success'}
                  onChange={() => {
                    setTestMethod('card_success');
                    setCardNumber('4242 •••• •••• 4242');
                  }}
                  className="text-[#2563EB]"
                />
                <div>
                  <span className="font-bold text-[#163A70] block">Test Card (Success Simulation)</span>
                  <span className="text-[11px] text-[#64748B]">4242 •••• •••• 4242 • Standard Passing Test Card</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Passes
              </span>
            </label>

            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              testMethod === 'upi_test' ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#CBD5E1] bg-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stripe_test"
                  checked={testMethod === 'upi_test'}
                  onChange={() => setTestMethod('upi_test')}
                  className="text-[#2563EB]"
                />
                <div>
                  <span className="font-bold text-[#163A70] block">Stripe UPI (Test VPA)</span>
                  <span className="text-[11px] text-[#64748B]">success@stripe • Simulated Indian UPI payment flow</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Passes
              </span>
            </label>

            <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              testMethod === 'card_fail' ? 'border-rose-400 bg-rose-50' : 'border-[#CBD5E1] bg-white'
            }`}>
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="stripe_test"
                  checked={testMethod === 'card_fail'}
                  onChange={() => {
                    setTestMethod('card_fail');
                    setCardNumber('4000 •••• •••• 0002');
                  }}
                  className="text-rose-600"
                />
                <div>
                  <span className="font-bold text-rose-900 block">Test Card (Declined Simulation)</span>
                  <span className="text-[11px] text-[#64748B]">4000 •••• •••• 0002 • Tests failure state &amp; error handling</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                Fails
              </span>
            </label>
          </div>
        </div>

        {/* Card Fields Preview */}
        {testMethod !== 'upi_test' && (
          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2">
            <div className="flex justify-between items-center text-[11px] text-[#64748B]">
              <span>Simulated Card Input</span>
              <Lock className="w-3.5 h-3.5 text-[#2563EB]" />
            </div>
            <div className="font-mono text-sm tracking-wider font-bold text-[#163A70] bg-white p-2 rounded-lg border border-[#CBD5E1]">
              {cardNumber}
            </div>
            <div className="flex gap-2">
              <div className="flex-1 font-mono text-xs bg-white p-2 rounded-lg border border-[#CBD5E1] text-[#64748B]">
                EXP: {expiry}
              </div>
              <div className="w-20 font-mono text-xs bg-white p-2 rounded-lg border border-[#CBD5E1] text-[#64748B]">
                CVC: {cvc}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant={testMethod === 'card_fail' ? 'danger' : 'primary'}
            size="sm"
            loading={loading}
            className="flex items-center gap-1.5 shadow-sm"
          >
            <CreditCard className="w-4 h-4" />
            <span>
              {testMethod === 'card_fail'
                ? 'Simulate Card Decline'
                : `Authorize Test Payment (${formatCurrency(amount)})`}
            </span>
          </Button>
        </div>
      </form>
    </Modal>
  );
}

