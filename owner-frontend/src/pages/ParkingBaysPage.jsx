import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  CheckCircle2, 
  Car, 
  AlertTriangle, 
  Grid, 
  ToggleLeft, 
  ToggleRight, 
  Download, 
  RotateCcw, 
  Edit3,
  ShieldAlert,
  Clock,
  History,
  Info
} from 'lucide-react';

export default function ParkingBaysPage({ onSelectSpotForOverride }) {
  const { 
    activeSpots, 
    totalSpots, 
    availableSpots, 
    parkedSpots, 
    needsCheckSpots, 
    camera, 
    toggleCameraDetection, 
    statusHistory, 
    downloadReport 
  } = useParkit();

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Parking Spots & Status
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage individual parking bays, view camera detections, and apply manual status overrides.
          </p>
        </div>

        {/* Camera Detection ON/OFF Toggle */}
        <div className="flex items-center space-x-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 shrink-0">
          <div className="text-left text-xs">
            <span className="font-semibold text-gray-900 block">Camera Detection</span>
            <span className={`text-[11px] font-medium ${camera.isDetectionActive ? 'text-green-600' : 'text-gray-500'}`}>
              {camera.isDetectionActive ? 'Active (Auto-sync)' : 'Paused (Manual only)'}
            </span>
          </div>

          <button
            onClick={toggleCameraDetection}
            className="text-gray-600 hover:text-gray-900 transition-transform active:scale-95"
            title="Toggle camera detection active state"
          >
            {camera.isDetectionActive ? (
              <ToggleRight className="h-8 w-8 text-blue-600" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Spots */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spots</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalSpots}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <Grid className="h-5 w-5" />
          </div>
        </div>

        {/* Available */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-green-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Available</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{availableSpots}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        {/* Parked */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-red-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Parked</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{parkedSpots}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
            <Car className="h-5 w-5" />
          </div>
        </div>

        {/* Needs Check */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between border-l-4 border-l-orange-500">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Needs Check</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{needsCheckSpots}</p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Parking Spot Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">All Parking Spaces</h2>
          <span className="text-xs text-gray-500">Click "Change Status" on any card to update</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeSpots.map((spot) => {
            const isAvailable = spot.status === 'AVAILABLE';
            const isParked = spot.status === 'PARKED';
            const isWarning = spot.status === 'NEEDS_CHECK';

            return (
              <div
                key={spot.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4 flex flex-col justify-between hover:border-gray-300 transition-colors"
              >
                {/* Card Top */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{spot.spotNumber}</h3>
                      <p className="text-xs text-gray-500">{spot.level}</p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isAvailable
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : isParked
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {isAvailable ? 'Available' : isParked ? 'Parked' : 'Needs Check'}
                    </span>
                  </div>

                  {/* Icon & Center status illustration */}
                  <div className={`p-4 rounded-xl border flex items-center space-x-3 ${
                    isAvailable
                      ? 'bg-green-50/40 border-green-100 text-green-800'
                      : isParked
                      ? 'bg-red-50/40 border-red-100 text-red-800'
                      : 'bg-orange-50/40 border-orange-100 text-orange-800'
                  }`}>
                    {isAvailable && <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />}
                    {isParked && <Car className="h-6 w-6 text-red-600 shrink-0" />}
                    {isWarning && <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0" />}

                    <div className="text-xs">
                      <div className="font-semibold">
                        {isAvailable && "Ready for Next Car"}
                        {isParked && (spot.vehicleInfo || "Vehicle Detected")}
                        {isWarning && "Ambiguous Detection"}
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Camera reading: <strong className="text-gray-700">{spot.cameraReading}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Camera Check Result & Manual note */}
                  <div className="text-xs text-gray-600 space-y-1">
                    <p className="text-[11px] text-gray-500">
                      Camera check: <span className="text-gray-700 font-medium">{spot.notes}</span>
                    </p>
                    {spot.manualOverride && (
                      <div className="p-2 rounded bg-blue-50 text-blue-800 text-[11px] border border-blue-100">
                        Manual override by <strong>{spot.manualOverride.overriddenBy}</strong>: "{spot.manualOverride.reason}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Change Status Button */}
                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onSelectSpotForOverride(spot)}
                    className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-blue-600" />
                    <span>Change Status</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Change History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
              <History className="h-4 w-4 text-blue-600" />
              <span>Change History</span>
            </h3>
            <p className="text-xs text-gray-500">Record of manual changes and automated camera status updates</p>
          </div>

          <button
            onClick={() => downloadReport('history')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            <span>Export History CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Spot</th>
                <th className="py-3 px-3">Changed To</th>
                <th className="py-3 px-3">Changed By</th>
                <th className="py-3 px-3">Reason / Detail</th>
                <th className="py-3 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {statusHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-gray-900">{item.spot}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.changedTo === 'AVAILABLE'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : item.changedTo === 'PARKED'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {item.changedTo}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-700">{item.changedBy}</td>
                  <td className="py-3 px-3 text-gray-500">{item.reason}</td>
                  <td className="py-3 px-3 text-right text-gray-400 font-mono text-[11px]">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
