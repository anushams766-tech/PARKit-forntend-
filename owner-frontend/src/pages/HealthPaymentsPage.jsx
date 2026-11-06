import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  Activity, 
  Video, 
  RefreshCw, 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Server,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function HealthPaymentsPage() {
  const { 
    camera, 
    reconnectCamera, 
    payments, 
    downloadReport, 
    showToast 
  } = useParkit();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'SUCCEEDED' | 'FAILED'

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.driver.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.spot.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const isCameraOnline = camera.status === 'ONLINE';

  return (
    <div className="space-y-6">
      
      {/* Header & Overall Status */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              System Health & Payments
            </h1>
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-600 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Real-time telemetry for computer-vision cameras and verified parking transaction logs.
          </p>
        </div>

        <button
          onClick={reconnectCamera}
          className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Camera Status Card (Detailed Telemetry) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <span>Camera Connection & Feed Status</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isCameraOnline ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {isCameraOnline ? 'Online' : 'Offline'}
                </span>
              </h3>
              <p className="text-xs text-gray-500">{camera.name} ({camera.id})</p>
            </div>
          </div>

          <button
            onClick={reconnectCamera}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
          >
            Reconnect Camera
          </button>
        </div>

        {/* Telemetry Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Connection Status</span>
            <span className="font-bold text-green-700 font-mono mt-0.5 block">{camera.status}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Video Quality</span>
            <span className="font-bold text-gray-900 font-mono mt-0.5 block">{camera.videoQuality}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Delay / Latency</span>
            <span className="font-bold text-blue-700 font-mono mt-0.5 block">{camera.latency}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Dropped Frames</span>
            <span className="font-bold text-gray-700 font-mono mt-0.5 block">{camera.droppedFrames}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Last Signal Received</span>
            <span className="font-bold text-gray-700 font-mono mt-0.5 block">{camera.lastSignal}</span>
          </div>

          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs">
            <span className="text-gray-500 block text-[11px]">Detection Engine</span>
            <span className="font-bold text-gray-900 font-mono mt-0.5 block">OpenCV Active</span>
          </div>

        </div>

        {/* Camera Address Bar */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-gray-700">Camera Stream Address:</span>
            <code className="text-blue-700 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{camera.address}</code>
          </div>
          <span className="text-[11px] text-gray-500">Configured via IP Webcam RTSP/HTTP feed</span>
        </div>
      </div>

      {/* Payment Activity Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        
        {/* Header with Title and Test Mode Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-gray-900">Payment Activity</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                Stripe Test Mode
              </span>
            </div>
            <p className="text-xs text-gray-500">Verified transaction receipts and server-calculated fees</p>
          </div>

          <button
            onClick={() => downloadReport('payments')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm shrink-0"
          >
            <Download className="h-3.5 w-3.5 text-gray-500" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by driver, spot, or ID..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 self-start sm:self-auto text-xs">
            <span className="text-gray-500 font-medium">Filter:</span>
            <div className="flex rounded-lg border border-gray-300 bg-white p-0.5 shadow-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'ALL' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('SUCCEEDED')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'SUCCEEDED' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Successful
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('FAILED')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  statusFilter === 'FAILED' ? 'bg-blue-600 text-white font-semibold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Failed
              </button>
            </div>
          </div>

        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Transaction ID</th>
                <th className="py-3 px-3">Driver</th>
                <th className="py-3 px-3">Spot Assigned</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment Status</th>
                <th className="py-3 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((p) => {
                const isSuccess = p.status === 'SUCCEEDED';
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">{p.id}</td>
                    <td className="py-3 px-3 font-semibold text-gray-900">{p.driver}</td>
                    <td className="py-3 px-3 text-gray-700">{p.spot}</td>
                    <td className="py-3 px-3 text-gray-500">{p.timeParked}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">₹{p.amount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuccess
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {isSuccess ? 'Successful' : 'Failed'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-gray-500 font-mono text-[11px]">{p.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
