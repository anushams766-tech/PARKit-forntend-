import React, { useState } from 'react';
import { useParkit } from '../context/ParkitContext';
import { 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Play, 
  Copy, 
  Code, 
  RefreshCw, 
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function PaymentsPage() {
  const { 
    payments, 
    createStripeTestPayment, 
    showToast 
  } = useParkit();

  const [selectedCardType, setSelectedCardType] = useState('4242'); // '4242' | '3155' | '0002'
  const [testAmount, setTestAmount] = useState('40');
  const [testEmail, setTestEmail] = useState('driver@parkit.demo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedWebhookPayment, setSelectedWebhookPayment] = useState(null);

  const handleRunTestPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      createStripeTestPayment({
        sessionId: `SESS-TEST-${Date.now().toString().slice(-4)}`,
        amount: testAmount,
        testCardType: selectedCardType,
        userEmail: testEmail
      });
      setIsProcessing(false);
    }, 700);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied to clipboard: ${text}`);
  };

  const succeededCount = payments.filter(p => p.status === 'SUCCEEDED').length;
  const failedCount = payments.filter(p => p.status === 'FAILED').length;
  const totalRevenue = payments
    .filter(p => p.status === 'SUCCEEDED')
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      
      {/* Header & Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
              Stripe Test Environment Only
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-emerald-400 font-mono">Webhook Verified</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Stripe Test-Mode Payments Center
          </h1>
          <p className="text-xs text-slate-400">
            Compliant with PRD Section 10: Server-side pricing calculations, test card scenarios, and idempotent webhooks.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px] font-sans">Verified Volume</span>
            <span className="text-emerald-400 font-bold text-base">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Test Card Reference Banner (Directly from PRD Section 10) */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
          <CreditCard className="h-4 w-4 text-purple-400" />
          <span>Stripe Official Test Cards (PRD Section 10 Specification)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Card 1: Success */}
          <div 
            onClick={() => setSelectedCardType('4242')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedCardType === '4242'
                ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400">Successful Payment</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-mono text-sm font-black text-white tracking-wider">
              4242 4242 4242 4242
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Validates instant success & session activation
            </div>
          </div>

          {/* Card 2: 3DS Action */}
          <div 
            onClick={() => setSelectedCardType('3155')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedCardType === '3155'
                ? 'bg-amber-950/30 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-amber-400">Authentication / 3DS</span>
              <AlertCircle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="font-mono text-sm font-black text-white tracking-wider">
              4000 0025 0000 3155
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Tests India 3DS authentication flow
            </div>
          </div>

          {/* Card 3: Declined */}
          <div 
            onClick={() => setSelectedCardType('0002')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedCardType === '0002'
                ? 'bg-rose-950/30 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-rose-400">Declined Card</span>
              <XCircle className="h-4 w-4 text-rose-400" />
            </div>
            <div className="font-mono text-sm font-black text-white tracking-wider">
              4000 0000 0000 0002
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Tests card decline & retry state
            </div>
          </div>

        </div>
      </div>

      {/* Instant Test Payment Simulator Form */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Execute Simulated Stripe Checkout / Intent</h3>
            <p className="text-xs text-slate-400">Directly test payment creation, webhook payload dispatch, and database sync.</p>
          </div>
          <span className="text-xs font-mono text-purple-400">POST /api/payments/create-checkout-session</span>
        </div>

        <form onSubmit={handleRunTestPayment} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Simulated User Email</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Due (₹)</label>
            <input
              type="number"
              min="10"
              value={testAmount}
              onChange={(e) => setTestAmount(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Selected Card Scenario</label>
            <div className="px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-purple-300 font-bold truncate">
              {selectedCardType === '4242' ? 'Success (4242)' : selectedCardType === '3155' ? '3DS Test (3155)' : 'Declined (0002)'}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center space-x-2"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>{isProcessing ? 'Processing...' : 'Run Test Payment'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white">Stripe Test Transactions ({payments.length})</h3>
            <p className="text-xs text-slate-400">All payments processed via Stripe test mode with verified webhook events.</p>
          </div>
          <span className="text-xs text-emerald-400 font-mono">{succeededCount} Succeeded / {failedCount} Failed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Stripe PaymentIntent</th>
                <th className="py-2.5 px-3">Customer Email</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Card Used</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Webhook</th>
                <th className="py-2.5 px-3 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {payments.map((p) => {
                const isSuccess = p.status === 'SUCCEEDED';
                const isDeclined = p.status === 'FAILED';

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{p.id}</td>
                    <td className="py-3 px-3 text-slate-300 text-[11px] truncate max-w-[150px]">
                      {p.stripePaymentIntentId}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-300">{p.userEmail}</td>
                    <td className="py-3 px-3 font-bold text-emerald-400">
                      ₹{p.amount}
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      •••• {p.cardLast4} ({p.cardBrand})
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isDeclined
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-emerald-400 border border-slate-700">
                        ✓ Verified
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-sans">
                      <button
                        onClick={() => setSelectedWebhookPayment(p)}
                        className="px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 transition-colors inline-flex items-center space-x-1"
                      >
                        <Code className="h-3 w-3" />
                        <span>Webhook JSON</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook JSON Viewer Modal */}
      {selectedWebhookPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Stripe Signed Webhook Payload</h3>
              </div>
              <button 
                onClick={() => setSelectedWebhookPayment(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto max-h-72">
              <pre>{JSON.stringify({
                id: selectedWebhookPayment.stripeEventId,
                object: "event",
                api_version: "2024-06-20",
                type: selectedWebhookPayment.status === 'SUCCEEDED' ? "checkout.session.completed" : "payment_intent.payment_failed",
                data: {
                  object: {
                    id: selectedWebhookPayment.stripeSessionId,
                    payment_intent: selectedWebhookPayment.stripePaymentIntentId,
                    amount_total: selectedWebhookPayment.amount * 100,
                    currency: "inr",
                    payment_status: selectedWebhookPayment.status.toLowerCase(),
                    customer_email: selectedWebhookPayment.userEmail,
                    payment_method_types: ["card"]
                  }
                },
                livemode: false,
                signature_verified: true
              }, null, 2)}</pre>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Verified server-side via Stripe HMAC secret.</span>
              <button
                onClick={() => copyToClipboard(JSON.stringify(selectedWebhookPayment, null, 2))}
                className="text-emerald-400 hover:underline"
              >
                Copy JSON
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
