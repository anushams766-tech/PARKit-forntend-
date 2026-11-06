import React from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  CheckCircle2, 
  Car, 
  AlertTriangle, 
  Grid, 
  Download, 
  RefreshCw, 
  Video, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function OverviewPage({ setActiveTab, onSelectSpotForOverride }) {
  const { 
    activeLocation, 
    activeSpots, 
    totalSpots, 
    availableSpots, 
    parkedSpots, 
    needsCheckSpots, 
    camera, 
    reconnectCamera, 
    payments, 
    downloadReport 
  } = useParkit();

  const isCameraOnline = camera.status === 'ONLINE';

  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Parking Overview
            </h1>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
              <span>System Active</span>
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            <span>
              Facility: <strong className="text-gray-900 font-semibold">{activeLocation.name}</strong>
            </span>
            <span className="text-gray-300">•</span>
            <span>{activeLocation.level}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-700 font-medium">📍 {activeLocation.address}</span>
          </div>
        </div>

        <button
          onClick={() => downloadReport('overview')}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors shrink-0"
        >
          <Download className="h-4 w-4 text-gray-500" />
          <span>Download Report</span>
        </button>
      </div>

      {/* 4 Summary Cards (Light Theme, Clean, Proper Colors) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Spots */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Spots
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalSpots}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Configured bays</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600">
            <Grid className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Available Now (Green) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-green-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Available Now
            </p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {availableSpots}
            </p>
            <p className="text-xs text-green-700 mt-0.5 font-medium">Ready for parking</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Currently Parked (Red) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Currently Parked
            </p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {parkedSpots}
            </p>
            <p className="text-xs text-red-700 mt-0.5 font-medium">Occupied spaces</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
            <Car className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Needs Check (Orange) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-orange-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Needs Check
            </p>
            <p className="text-3xl font-bold text-orange-600 mt-1">
              {needsCheckSpots}
            </p>
            <p className="text-xs text-orange-700 mt-0.5 font-medium">Requires review</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Live Camera Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        
        {/* Camera Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-gray-900">
                  Live Camera Feed
                </h3>
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium ${
                  isCameraOnline ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${isCameraOnline ? 'bg-green-600' : 'bg-red-600'}`}></span>
                  <span>{isCameraOnline ? 'Camera Online' : 'Camera Offline'}</span>
                </span>
              </div>
              <p className="text-xs text-gray-500">{camera.name} • {camera.videoQuality}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span>Last updated: <strong className="text-gray-700">{camera.lastUpdated}</strong></span>
            <button
              onClick={reconnectCamera}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
              <span>Refresh Camera</span>
            </button>
          </div>
        </div>

        {/* Camera Preview Area (Clean Light Neutral Container) */}
        {isCameraOnline ? (
          <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-300 aspect-video flex items-center justify-center shadow-inner">
            
            {/* Miniature lot layout simulation with realistic ground styling */}
            <div className="absolute inset-0 bg-slate-100 flex flex-col justify-between p-6 sm:p-8">
              
              {/* Top Row: Spots 1, 2, 3 */}
              <div className="grid grid-cols-3 gap-4 h-[44%]">
                {activeSpots.slice(0, 3).map((spot) => {
                  const isAvailable = spot.status === 'AVAILABLE';
                  const isParked = spot.status === 'PARKED';
                  const isWarning = spot.status === 'NEEDS_CHECK';

                  return (
                    <div
                      key={spot.id}
                      onClick={() => onSelectSpotForOverride(spot)}
                      className={`relative rounded-lg border-2 p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                        isAvailable
                          ? 'bg-green-50/70 border-green-500 text-green-900 shadow-sm'
                          : isParked
                          ? 'bg-red-50/70 border-red-500 text-red-900 shadow-sm'
                          : 'bg-orange-50/70 border-orange-500 text-orange-900 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs bg-white/90 px-2 py-0.5 rounded shadow-xs text-gray-900">
                          {spot.spotNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAvailable
                            ? 'bg-green-600 text-white'
                            : isParked
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}>
                          {isAvailable ? 'AVAILABLE' : isParked ? 'OCCUPIED' : 'NEEDS CHECK'}
                        </span>
                      </div>

                      <div className="text-center my-auto">
                        {isParked && (
                          <div className="space-y-0.5">
                            <Car className="h-8 w-8 text-red-600 mx-auto" />
                            <span className="text-[11px] font-semibold text-gray-800 block truncate">{spot.vehicleInfo}</span>
                          </div>
                        )}
                        {isAvailable && (
                          <div className="space-y-0.5">
                            <CheckCircle2 className="h-7 w-7 text-green-600 mx-auto opacity-80" />
                            <span className="text-[11px] font-medium text-green-800 block">Open Space</span>
                          </div>
                        )}
                        {isWarning && (
                          <div className="space-y-0.5">
                            <AlertTriangle className="h-7 w-7 text-orange-600 mx-auto" />
                            <span className="text-[11px] font-medium text-orange-800 block">Attention Needed</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-gray-500 flex justify-between font-mono">
                        <span>Confidence</span>
                        <span className="font-bold text-gray-700">{(spot.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Central Driving Lane Divider */}
              <div className="h-8 border-y-2 border-dashed border-gray-300 flex items-center justify-center my-2">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-0.5 rounded">
                  Driveway / Center Lane
                </span>
              </div>

              {/* Bottom Row: Spots 4, 5, 6 */}
              <div className="grid grid-cols-3 gap-4 h-[44%]">
                {activeSpots.slice(3, 6).map((spot) => {
                  const isAvailable = spot.status === 'AVAILABLE';
                  const isParked = spot.status === 'PARKED';
                  const isWarning = spot.status === 'NEEDS_CHECK';

                  return (
                    <div
                      key={spot.id}
                      onClick={() => onSelectSpotForOverride(spot)}
                      className={`relative rounded-lg border-2 p-3 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] ${
                        isAvailable
                          ? 'bg-green-50/70 border-green-500 text-green-900 shadow-sm'
                          : isParked
                          ? 'bg-red-50/70 border-red-500 text-red-900 shadow-sm'
                          : 'bg-orange-50/70 border-orange-500 text-orange-900 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs bg-white/90 px-2 py-0.5 rounded shadow-xs text-gray-900">
                          {spot.spotNumber}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAvailable
                            ? 'bg-green-600 text-white'
                            : isParked
                            ? 'bg-red-600 text-white'
                            : 'bg-orange-600 text-white'
                        }`}>
                          {isAvailable ? 'AVAILABLE' : isParked ? 'OCCUPIED' : 'NEEDS CHECK'}
                        </span>
                      </div>

                      <div className="text-center my-auto">
                        {isParked && (
                          <div className="space-y-0.5">
                            <Car className="h-8 w-8 text-red-600 mx-auto" />
                            <span className="text-[11px] font-semibold text-gray-800 block truncate">{spot.vehicleInfo}</span>
                          </div>
                        )}
                        {isAvailable && (
                          <div className="space-y-0.5">
                            <CheckCircle2 className="h-7 w-7 text-green-600 mx-auto opacity-80" />
                            <span className="text-[11px] font-medium text-green-800 block">Open Space</span>
                          </div>
                        )}
                        {isWarning && (
                          <div className="space-y-0.5">
                            <AlertTriangle className="h-7 w-7 text-orange-600 mx-auto" />
                            <span className="text-[11px] font-medium text-orange-800 block">Attention Needed</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[10px] text-gray-500 flex justify-between font-mono">
                        <span>Confidence</span>
                        <span className="font-bold text-gray-700">{(spot.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Camera Overlay Badge */}
            <div className="absolute top-3 left-3 bg-white/95 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 font-medium shadow-sm flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-ping"></span>
              <span>LIVE CV STREAM</span>
              <span className="text-gray-300">|</span>
              <span className="font-mono">{camera.address}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-md border border-gray-200 text-[11px] text-gray-600 shadow-sm">
              Click any spot to change its status manually
            </div>

          </div>
        ) : (
          <div className="p-12 text-center rounded-xl bg-gray-50 border border-gray-200 space-y-3">
            <Video className="h-10 w-10 text-gray-400 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700">Camera Feed is Offline</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              The camera stream could not be reached. Please check the network address or click reconnect below.
            </p>
            <button
              onClick={reconnectCamera}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Reconnect Camera
            </button>
          </div>
        )}

      </div>

      {/* Spot Status Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Parking Spot Status</h3>
            <p className="text-xs text-gray-500">Overview of all individual bays and detection results</p>
          </div>
          <button
            onClick={() => setActiveTab('bays')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Manage All Spots</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSpots.map((spot) => {
            const isAvailable = spot.status === 'AVAILABLE';
            const isParked = spot.status === 'PARKED';
            const isWarning = spot.status === 'NEEDS_CHECK';

            return (
              <div
                key={spot.id}
                onClick={() => onSelectSpotForOverride(spot)}
                className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all cursor-pointer shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{spot.spotNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    isAvailable
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : isParked
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-orange-50 text-orange-700 border border-orange-200'
                  }`}>
                    {isAvailable ? 'Available' : isParked ? 'Occupied' : 'Needs Check'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-gray-600">
                  {isParked && (
                    <p className="font-medium text-gray-900 flex items-center space-x-1">
                      <Car className="h-3.5 w-3.5 text-gray-500" />
                      <span>{spot.vehicleInfo}</span>
                    </p>
                  )}
                  {isAvailable && (
                    <p className="text-green-700 font-medium">
                      Available for: {spot.emptyDuration}
                    </p>
                  )}
                  {isWarning && (
                    <p className="text-orange-700 font-medium">
                      Ambiguous camera contour
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400">
                    Camera check: {spot.lastChecked} ({(spot.confidence * 100).toFixed(0)}% match)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900">Recent Payments</h3>
            <p className="text-xs text-gray-500">Verified parking transactions and fees</p>
          </div>
          <button
            onClick={() => setActiveTab('health-payments')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All Payments</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Spot</th>
                <th className="py-3 px-3">Time Parked</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payments.slice(0, 4).map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-gray-900">{p.driver}</td>
                  <td className="py-3 px-3 text-gray-700">{p.spot}</td>
                  <td className="py-3 px-3 text-gray-500">{p.timeParked}</td>
                  <td className="py-3 px-3 font-semibold text-gray-900">₹{p.amount}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      p.status === 'SUCCEEDED'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {p.status === 'SUCCEEDED' ? 'Successful' : 'Declined'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
