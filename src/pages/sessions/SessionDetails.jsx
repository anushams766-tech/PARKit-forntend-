import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { sessionService } from '../../services/sessionService';
import Loader from '../../components/common/Loader';
import ErrorState from '../../components/common/ErrorState';
import { ArrowLeft, Car, MapPin, Clock, CreditCard, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

export default function SessionDetails() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await sessionService.getSessionById(sessionId);
        if (res.data) {
          setSession(res.data);
        } else {
          setError('Session not found.');
        }
      } catch (err) {
        setError('Error fetching session details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  if (loading) return <Loader text="Retrieving session invoice..." />;
  if (error || !session) return <ErrorState message={error || 'Session not found'} />;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in">
      <Link
        to="/sessions"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#2563EB]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Sessions</span>
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                Session Invoice
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                DEMO DATA
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#163A70] mt-1">
              {session.locationName}
            </h2>
            <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
              {session.locationAddress}
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-extrabold text-[#2563EB]">
              {formatCurrency(session.amountPaid || session.estimatedAmount)}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
              <CheckCircle2 className="w-3 h-3" />
              {session.status}
            </span>
          </div>
        </div>

        {/* Vehicle & Slot Info */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Driver</span>
            <strong className="text-[#163A70] flex items-center gap-1">
              <User className="w-3 h-3 text-[#2563EB]" />
              {session.driverName || 'Driver'}
            </strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Vehicle Plate</span>
            <strong className="font-mono text-sm text-[#2563EB]">{session.vehiclePlate}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Model / Type</span>
            <strong className="text-[#172554]">{session.vehicleModel}</strong>
          </div>
          <div>
            <span className="text-[10px] text-[#64748B] uppercase font-bold block">Assigned Bay</span>
            <strong className="text-sm font-mono text-[#2563EB]">{session.slotNumber || 'Bay 01'}</strong>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-3 text-xs">
          <h4 className="font-extrabold text-[#163A70] uppercase tracking-wider text-[11px]">
            Timeline &amp; Duration
          </h4>
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Entry Timestamp:</span>
              <strong className="text-[#172554]">{formatDateTime(session.entryTime)}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Exit Timestamp:</span>
              <strong className="text-[#172554]">
                {session.exitTime ? formatDateTime(session.exitTime) : 'Ongoing active session'}
              </strong>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
              <span className="text-[#64748B]">Calculated Duration:</span>
              <strong className="text-[#172554]">~{session.durationMinutes} minutes</strong>
            </div>
          </div>
        </div>

        {/* Reference */}
        <div className="flex items-center justify-between text-xs text-[#64748B] pt-3 border-t border-[#E2E8F0]">
          <span className="font-mono text-[11px]">Ref: {session.transactionId || session.id}</span>
          <span className="flex items-center gap-1 text-[#2563EB] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified by Backend Vision
          </span>
        </div>
      </div>
    </div>
  );
}
