import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { locationService } from '../../services/locationService';
import { vehicleService } from '../../services/vehicleService';
import { paymentService } from '../../services/paymentService';
import { sessionService } from '../../services/sessionService';
import { useAuth } from '../../context/AuthContext';
import PaymentSummary from '../../components/payment/PaymentSummary';
import CheckoutForm from '../../components/payment/CheckoutForm';
import StripeTestModal from '../../components/payment/StripeTestModal';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { ArrowLeft, ShieldCheck, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { formatCurrency } from '../../utils/formatters';

export default function Checkout() {
  const { locationId } = useParams();
  const navigate = useNavigate();
  const { isSampleMode } = useAuth();
  const { addToast } = useNotification();

  const [location, setLocation] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stripe test modal state
  const [stripeModalOpen, setStripeModalOpen] = useState(false);
  const [gatewayModalOpen, setGatewayModalOpen] = useState(false);
  const [pendingSessionData, setPendingSessionData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [locRes, vehRes] = await Promise.all([
          locationService.getLocationById(locationId),
          vehicleService.getUserVehicles(),
        ]);
        setLocation(locRes.data);
        setVehicles(vehRes.data || []);
      } catch (err) {
        setError('Unable to load checkout details for this parking hub.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locationId]);

  const handleCheckoutSubmit = async ({ vehiclePlate, durationHours, hourlyRate, paymentMethod }) => {
    setCheckoutLoading(true);
    const subtotal = durationHours * hourlyRate;
    const taxes = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST standard
    const calculatedAmount = subtotal + taxes;

    const sessionPayload = {
      locationId,
      locationName: location?.name || 'Mysore Hub',
      locationAddress: location?.address || 'Mysore',
      vehiclePlate,
      durationMinutes: durationHours * 60,
      hourlyRate,
      amountPaid: calculatedAmount,
      paymentMethod,
      entryTime: new Date().toISOString(),
      status: 'ACTIVE',
    };

    setPendingSessionData(sessionPayload);

    try {
      const res = await paymentService.createCheckoutSession({
        locationId,
        vehiclePlate,
        durationHours,
        amount: calculatedAmount,
        paymentMethod,
      });

      // If backend provides a Stripe hosted checkout URL, redirect to it
      if (res.data?.url && res.data.url.startsWith('http')) {
        window.location.href = res.data.url;
        return;
      }

      // If payment method is Stripe or user is testing checkout
      if (paymentMethod.toLowerCase().includes('stripe') || !res.isLive) {
        setStripeModalOpen(true);
      } else if (isSampleMode) {
        await sessionService.recordSession(sessionPayload);
        await paymentService.recordPayment({
          locationName: location?.name,
          vehiclePlate,
          amount: calculatedAmount,
          paymentMethod,
          transactionId: 'STRIPE_TEST_' + Date.now().toString(36).toUpperCase(),
          status: 'COMPLETED',
        });
        navigate(`/payment-result?session_id=STRIPE_TEST_${Date.now()}&status=success&amount=${calculatedAmount}&location_id=${locationId}`);
      } else {
        setGatewayModalOpen(true);
      }
    } catch (err) {
      setStripeModalOpen(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleStripePaymentComplete = async ({ status, transactionId, paymentMethod, error }) => {
    setStripeModalOpen(false);

    if (status === 'COMPLETED') {
      const txn = transactionId || 'STRIPE_TEST_' + Date.now().toString(36).toUpperCase();
      // Record session & payment
      await sessionService.recordSession({
        ...pendingSessionData,
        transactionId: txn,
      });

      await paymentService.recordPayment({
        locationName: location?.name,
        vehiclePlate: pendingSessionData?.vehiclePlate,
        amount: pendingSessionData?.amountPaid,
        paymentMethod: paymentMethod || 'Stripe Test Checkout',
        transactionId: txn,
        status: 'COMPLETED',
        source: isSampleMode ? 'DEMO' : 'TEST',
      });

      navigate(`/payment-result?session_id=${txn}&status=success&amount=${pendingSessionData?.amountPaid}&location_id=${locationId}`);
    } else {
      // Payment failure state
      const failTxn = 'STRIPE_FAIL_' + Date.now().toString(36).toUpperCase();
      navigate(`/payment-result?session_id=${failTxn}&status=failure&amount=${pendingSessionData?.amountPaid}&location_id=${locationId}&error=${encodeURIComponent(error || 'Card was declined')}`);
    }
  };

  const handleActivateAtBay = async () => {
    if (!pendingSessionData) return;
    await sessionService.recordSession(pendingSessionData);
    addToast('Parking session activated! Settle charge on arrival at the bay.', 'success');
    setGatewayModalOpen(false);
    navigate('/parking-history');
  };

  if (loading) return <Loader text="Preparing checkout gateway..." />;
  if (error || !location) return <ErrorState message={error || 'Location not found'} onRetry={() => navigate('/home')} />;

  return (
    <div className="max-w-4xl mx-auto space-y-5 animate-fade-in">
      <Link
        to={`/parking/${location.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#2563EB]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Parking Details</span>
      </Link>

      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
          Session Checkout &amp; Payment
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Select your vehicle, duration, and test payment method in Indian Rupees (₹) to activate parking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Form */}
        <CheckoutForm
          location={location}
          vehicles={vehicles}
          onSubmitCheckout={handleCheckoutSubmit}
          loading={checkoutLoading}
        />

        {/* Breakdown & Disclaimers */}
        <PaymentSummary
          location={location}
          vehicle={vehicles.find(v => v.isPrimary) || vehicles[0]}
          durationHours={2}
          hourlyRate={location.hourlyRate}
        />
      </div>

      {/* Stripe Test Mode Modal (Requirement 1) */}
      <StripeTestModal
        isOpen={stripeModalOpen}
        onClose={() => setStripeModalOpen(false)}
        amount={pendingSessionData?.amountPaid || 0}
        locationName={pendingSessionData?.locationName || location?.name}
        vehiclePlate={pendingSessionData?.vehiclePlate}
        onCompletePayment={handleStripePaymentComplete}
      />

      {/* Alternative Transparent Pay-at-Bay Modal */}
      <Modal
        isOpen={gatewayModalOpen}
        onClose={() => setGatewayModalOpen(false)}
        title="Alternative Payment Option"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-[#163A70]">Pay on Arrival Option</h5>
              <p className="text-[#64748B] leading-relaxed text-[11px]">
                You can activate this parking session immediately and settle your charge on arrival at the bay.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Hub:</span>
              <strong className="text-[#163A70]">{pendingSessionData?.locationName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Payable on arrival:</span>
              <strong className="text-[#2563EB] font-bold">{formatCurrency(pendingSessionData?.amountPaid || 0)}</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setGatewayModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleActivateAtBay}
            >
              Activate Session (Pay at Bay)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
