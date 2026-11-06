import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../../services/sessionService';
import { locationService } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';
import ParkingHistoryCard from '../../components/history/ParkingHistoryCard';
import ParkingHistoryTable from '../../components/history/ParkingHistoryTable';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import DemoDataBar from '../../components/common/DemoDataBar';
import { Clock, LayoutGrid, List, Search, Filter } from 'lucide-react';

export default function ParkingHistory() {
  const navigate = useNavigate();
  const { isSampleMode } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchPlate, setSearchPlate] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'COMPLETED' | 'ACTIVE' | 'CANCELLED'
  const [viewType, setViewType] = useState('cards'); // 'cards' | 'table'

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const sessRes = await sessionService.getUserSessions();
        setSessions(sessRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [isSampleMode]);

  const filteredSessions = sessions.filter((sess) => {
    const query = searchPlate.toLowerCase().trim();
    const matchesPlate =
      !query ||
      sess.vehiclePlate?.toLowerCase().includes(query) ||
      sess.locationName?.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'ALL' ||
      sess.status?.toUpperCase() === statusFilter;

    return matchesPlate && matchesStatus;
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Visible Demo Data Controls */}
      <DemoDataBar />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
            Parking History &amp; Receipts
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Audit history of your parked vehicles, durations, and Indian Rupee (₹) receipts.
          </p>
        </div>

        {/* View toggle (cards / table) */}
        <div className="flex items-center p-1 rounded-xl bg-white border border-[#CBD5E1] shadow-xs">
          <button
            type="button"
            onClick={() => setViewType('cards')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewType === 'cards' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#163A70]'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewType('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewType === 'table' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B] hover:text-[#163A70]'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value)}
            placeholder="Search by vehicle plate or location..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
          />
        </div>

        {/* Status Filter Tabs (Requirement 9: All, Completed, Active, Cancelled) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white border border-[#CBD5E1] overflow-x-auto shrink-0">
          {['ALL', 'COMPLETED', 'ACTIVE', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === tab
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
        <Loader text="Loading your parking session records..." />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No parking records found"
          description="Your completed and active parking sessions will be recorded here automatically."
        />
      ) : viewType === 'table' ? (
        <ParkingHistoryTable
          sessions={filteredSessions}
          onViewDetails={(sess) => navigate(`/sessions/${sess.id}`)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((sess) => (
            <ParkingHistoryCard
              key={sess.id}
              session={sess}
              onViewDetails={(s) => navigate(`/sessions/${s.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
