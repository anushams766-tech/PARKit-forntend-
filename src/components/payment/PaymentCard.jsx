import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { PAYMENT_STATUS } from '../../utils/constants';

export default function PaymentCard({ payment, onViewReceipt }) {
  if (!payment) return null;

  const isSuccess = payment.status === PAYMENT_STATUS.COMPLETED;

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] hover:border-[#2563EB] shadow-xs hover:shadow-md transition-all space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm text-[#163A70]">
                {payment.locationName}
              </h4>
              {(payment.source === 'DEMO' || payment.source === 'DEMO DATA') && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-300">
                  DEMO
                </span>
              )}
            </div>
            <p className="text-xs text-[#64748B] font-mono mt-0.5">
              Plate: <strong className="text-[#2563EB]">{payment.vehiclePlate}</strong> {payment.driverName ? `(${payment.driverName})` : ''}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-extrabold text-[#2563EB] block">
            {formatCurrency(payment.amount)}
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border ${
            isSuccess
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {isSuccess ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {payment.status}
          </span>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] flex items-center justify-between text-[#64748B]">
        <span>Method: <strong className="text-[#172554]">{payment.paymentMethod || 'UPI Payment'}</strong></span>
        <span>Date: <strong className="text-[#172554]">{formatDateTime(payment.date)}</strong></span>
      </div>

      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E2E8F0]">
        <span className="font-mono text-[10px] text-[#64748B] truncate max-w-[200px]">
          Txn Ref: {payment.transactionId}
        </span>

        {onViewReceipt && (
          <button
            type="button"
            onClick={() => onViewReceipt(payment)}
            className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
          >
            Receipt
          </button>
        )}
      </div>
    </div>
  );
}
