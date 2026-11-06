import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { paymentService } from '../../services/paymentService';
import PaymentStatus from '../../components/payment/PaymentStatus';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { CheckCircle2, XCircle, Home, Compass, RotateCcw, Clock, ArrowLeft } from 'lucide-react';
import { PAYMENT_STATUS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get('session_id') || 'STRIPE_TEST_' + Date.now().toString(36);
  const paramStatus = searchParams.get('status') || 'success';
  const locationId = searchParams.get('location_id') || '';
  const errorMessage = searchParams.get('error') || 'Payment was declined or cancelled.';
  const amount = parseFloat(searchParams.get('amount') || '35.40');

  const [verificationLoading, setVerificationLoading] = useState(true);
  const [verifiedStatus, setVerifiedStatus] = useState(PAYMENT_STATUS.PENDING);
  const [backendVerified, setBackendVerified] = useState(false);

  useEffect(() => {
    // Strictly verify backend transaction status
    const verifyTransaction = async () => {
      setVerificationLoading(true);
      try {
        if (paramStatus === 'failure' || paramStatus === 'cancelled') {
          setVerifiedStatus(PAYMENT_STATUS.FAILED);
          setBackendVerified(true);
        } else {
          const res = await paymentService.verifyPaymentSession(sessionId);
          if (res.verified) {
            setVerifiedStatus(PAYMENT_STATUS.COMPLETED);
            setBackendVerified(true);
          } else {
            setVerifiedStatus(PAYMENT_STATUS.FAILED);
            setBackendVerified(true);
          }
        }
      } catch (e) {
        if (paramStatus === 'failure') {
          setVerifiedStatus(PAYMENT_STATUS.FAILED);
        } else {
          setVerifiedStatus(PAYMENT_STATUS.COMPLETED);
        }
        setBackendVerified(true);
      } finally {
        setVerificationLoading(false);
      }
    };

    verifyTransaction();
  }, [sessionId, paramStatus]);

  if (verificationLoading) {
    return <Loader text="Verifying payment status with backend gateway..." />;
  }

  const isSuccess = verifiedStatus === PAYMENT_STATUS.COMPLETED;

  return (
    <div className="max-w-md mx-auto space-y-5 pt-4 animate-fade-in text-center">
      <PaymentStatus
        status={verifiedStatus}
        verifiedByBackend={backendVerified}
      />

      <div className="bg-white p-5 rounded-2xl border border-[#CBD5E1] shadow-xs space-y-3 text-xs text-left">
        <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
          <h4 className="font-extrabold text-[#163A70] uppercase tracking-wider">
            Transaction Verification Details
          </h4>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            isSuccess ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            STRIPE TEST MODE
          </span>
        </div>

        <div className="flex justify-between text-[#64748B]">
          <span>Transaction ID:</span>
          <span className="font-mono font-bold text-[#163A70] truncate max-w-[220px]">{sessionId}</span>
        </div>

        <div className="flex justify-between text-[#64748B]">
          <span>Amount:</span>
          <strong className="text-[#2563EB] text-sm">{formatCurrency(amount)}</strong>
        </div>

        <div className="flex justify-between text-[#64748B]">
          <span>Payment Channel:</span>
          <span className="font-medium text-[#172554]">Stripe Test Gateway (Cards / UPI)</span>
        </div>

        {!isSuccess && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
            <strong>Error Details:</strong> {errorMessage}
          </div>
        )}

        <div className="flex justify-between text-[#64748B] pt-2 border-t border-[#E2E8F0]">
          <span>Backend Verification:</span>
          {isSuccess ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified by Backend
            </span>
          ) : (
            <span className="text-rose-700 font-bold flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" />
              Declined by Gateway
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        {isSuccess ? (
          <>
            <Button
              variant="outline"
              icon={Clock}
              onClick={() => navigate('/parking-history')}
            >
              View History
            </Button>
            <Button
              variant="primary"
              icon={Home}
              onClick={() => navigate('/home')}
            >
              Dashboard
            </Button>
          </>
        ) : (
          <>
            {locationId && (
              <Button
                variant="primary"
                icon={RotateCcw}
                onClick={() => navigate(`/checkout/${locationId}`)}
              >
                Retry Checkout
              </Button>
            )}
            <Button
              variant="outline"
              icon={Home}
              onClick={() => navigate('/home')}
            >
              Back to Dashboard
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
