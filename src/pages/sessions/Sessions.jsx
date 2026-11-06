import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sessionService } from '../../services/sessionService';
import ParkingHistoryCard from '../../components/history/ParkingHistoryCard';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { Clock, Car, ChevronRight, Info } from 'lucide-react';
import { SESSION_STATUS } from '../../utils/constants';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'

  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        const res = await sessionService.getUserSessions();
        setSessions(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'ACTIVE') return s.status === SESSION_STATUS.ACTIVE;
    if (filter === 'COMPLETED') return s.status === SESSION_STATUS.COMPLETED;
    return true;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
              Parking Sessions
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
              DEMO DATA
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active Mysore vehicle parking sessions and completed trip summaries.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          {['ALL', 'ACTIVE', 'COMPLETED'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#163A70]'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader text="Loading your session records..." />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No sessions found"
          description="You do not have any sessions matching this filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((sess) => (
            <ParkingHistoryCard
              key={sess.id}
              session={sess}
              onViewDetails={(s) => window.location.href = `/sessions/${s.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
