import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { PAYMENT_STATUS } from '../../utils/constants';

export default function PaymentStatus({ status, verifiedByBackend = false }) {
  const configs = {
    [PAYMENT_STATUS.COMPLETED]: {
      icon: CheckCircle2,
      title: 'Payment Confirmed',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      desc: 'Simulated UPI transaction verified by PARKit telemetry backend.',
    },
    [PAYMENT_STATUS.FAILED]: {
      icon: XCircle,
      title: 'Payment Unsuccessful',
      color: 'text-rose-700',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      desc: 'The payment could not be processed. Please retry with a valid payment method.',
    },
    [PAYMENT_STATUS.PENDING]: {
      icon: Clock,
      title: 'Payment Processing',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      desc: 'Awaiting webhook verification from payment gateway.',
    },
    [PAYMENT_STATUS.CANCELLED]: {
      icon: AlertTriangle,
      title: 'Payment Cancelled',
      color: 'text-slate-700',
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      desc: 'The checkout session was cancelled before completion.',
    },
  };

  const current = configs[status] || configs[PAYMENT_STATUS.PENDING];
  const Icon = current.icon;

  return (
    <div className={`p-6 rounded-2xl border text-center space-y-2 ${current.bg} ${current.border}`}>
      <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${current.color} bg-white shadow-xs`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`text-lg font-extrabold ${current.color}`}>{current.title}</h3>
      <p className="text-xs text-[#64748B] max-w-sm mx-auto">{current.desc}</p>
    </div>
  );
}
