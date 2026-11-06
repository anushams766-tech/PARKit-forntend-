import { useState, useEffect } from 'react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../context/AuthContext';
import PaymentCard from '../../components/payment/PaymentCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import DemoDataBar from '../../components/common/DemoDataBar';
import { CreditCard, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function Payments() {
  const { isSampleMode, sampleProfile } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await paymentService.getUserPayments();
        setPayments(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [isSampleMode]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Visible Demo Data Controls */}
      <DemoDataBar />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              Payment Records &amp; Invoices
            </h2>
            {isSampleMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                Sample Receipts ({sampleProfile?.name || 'Demo'})
              </span>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Verified Indian Rupee (₹) transaction logs and parking receipts across Mysore hubs.
          </p>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your transaction history..." />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payment records found"
          description="Once you complete a parking session or settle a bay charge, your verified receipts will be recorded here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {payments.map((pay) => (
            <PaymentCard
              key={pay.id}
              payment={pay}
              onViewReceipt={(p) => setSelectedPayment(p)}
            />
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      <Modal
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
        title="Payment Receipt"
      >
        {selectedPayment && (
          <div className="space-y-4 text-xs">
            <div className="text-center py-4 bg-[#EFF6FF] rounded-2xl border border-[#BFDBFE] space-y-1">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-extrabold">Total Amount Paid</span>
              <p className="text-3xl font-extrabold text-[#2563EB]">
                {formatCurrency(selectedPayment.amount)}
              </p>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
                <CheckCircle2 className="w-3 h-3" />
                {selectedPayment.status}
              </span>
            </div>

            <div className="space-y-2.5 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="flex justify-between text-[#64748B]">
                <span>Parking Hub:</span>
                <strong className="text-[#172554]">{selectedPayment.locationName}</strong>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Vehicle Registration:</span>
                <strong className="font-mono text-[#2563EB]">{selectedPayment.vehiclePlate}</strong>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Date &amp; Time:</span>
                <strong className="text-[#172554]">{formatDateTime(selectedPayment.date)}</strong>
              </div>
              <div className="flex justify-between text-[#64748B]">
                <span>Payment Method:</span>
                <strong className="text-[#172554]">{selectedPayment.paymentMethod}</strong>
              </div>
              <div className="flex justify-between text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                <span>Transaction Ref ID:</span>
                <strong className="font-mono text-[11px] text-[#172554]">{selectedPayment.transactionId}</strong>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#2563EB] hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                Close Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
