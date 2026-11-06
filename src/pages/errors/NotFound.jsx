import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Compass, Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] flex items-center justify-center shadow-xs">
        <HelpCircle className="w-8 h-8" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#163A70]">
        404
      </h1>

      <h2 className="text-lg font-bold text-[#163A70]">
        Parking Bay or Route Not Found
      </h2>

      <p className="text-xs sm:text-sm text-[#64748B] max-w-sm">
        The page or location you requested is not available in our verified Mysore registry.
      </p>

      <div className="pt-2 flex items-center gap-3">
        <Link to="/home">
          <Button variant="primary" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
        <Link to="/explore">
          <Button variant="outline" icon={Compass}>
            Explore Spots
          </Button>
        </Link>
      </div>
    </div>
  );
}
