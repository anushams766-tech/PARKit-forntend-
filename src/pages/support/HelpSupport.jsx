import { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, ChevronDown, ChevronUp, CheckCircle2, ShieldCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useNotification } from '../../context/NotificationContext';

export default function HelpSupport() {
  const { addToast } = useNotification();
  const [activeFaq, setActiveFaq] = useState(null);
  const [ticketSent, setTicketSent] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const faqs = [
    {
      q: 'How does PARKit detect parking availability in Mysore?',
      a: 'PARKit connects to overhead camera vision systems installed at registered private and commercial parking hubs in Mysore. The system analyzes slot occupancy coordinates in real-time, categorizing slots as Empty (Available), Occupied, or Uncertain.',
    },
    {
      q: 'What does an "Uncertain" parking space status mean?',
      a: 'An Uncertain slot indicates visual occlusion (such as temporary shadows, weather conditions, or camera calibration in progress). To prevent arriving at a filled spot, PARKit strictly excludes Uncertain spaces from the available space count.',
    },
    {
      q: 'Does making a payment reserve or lock a parking space?',
      a: 'No. PARKit provides live computer vision telemetry so you know current bay availability. Payment covers the parking session charges for your duration and does not guarantee guaranteed physical slot locking or reservation.',
    },
    {
      q: 'Which payment methods are supported in India?',
      a: 'PARKit supports all standard Indian payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), RuPay and Visa/Mastercard Debit/Credit cards, and Net Banking.',
    },
    {
      q: 'What if I leave the parking space before my estimated duration ends?',
      a: 'Your session duration is automatically logged upon exit. Any unused prepaid duration credit will be refunded or applied to your next parking session.',
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) return;
    setTicketSent(true);
    addToast('Support ticket submitted successfully. Our team will contact you shortly.', 'success');
    setFormData({ subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#163A70]">
          Help &amp; Support
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          Frequently asked questions, driver assistance, and customer support.
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#163A70]">Customer Helpline</h4>
            <p className="text-xs text-[#64748B] mt-0.5">+91 1800 727 548 (Toll Free)</p>
            <span className="text-[10px] text-emerald-700 font-bold">Available 24x7</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-[#163A70]">Email Support</h4>
            <p className="text-xs text-[#64748B] mt-0.5">support@parkit.in</p>
            <span className="text-[10px] text-[#2563EB] font-bold">Responses within 2 hours</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <HelpCircle className="w-5 h-5 text-[#2563EB]" />
          <h3 className="font-extrabold text-base text-[#163A70]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E2E8F0] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-colors cursor-pointer"
                >
                  <span className="font-bold text-xs text-[#163A70]">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#64748B] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-[#64748B] leading-relaxed border-t border-[#E2E8F0]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Send Message Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8F0]">
          <MessageSquare className="w-5 h-5 text-[#2563EB]" />
          <h3 className="font-extrabold text-base text-[#163A70]">
            Send Support Request
          </h3>
        </div>

        {ticketSent ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Support Request Received</span>
            </div>
            <p>Our team in Mysore has received your query and will respond shortly to your email address.</p>
            <button
              type="button"
              onClick={() => setTicketSent(false)}
              className="text-[#2563EB] font-bold hover:underline mt-2 inline-block cursor-pointer"
            >
              Submit another inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Subject / Topic"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="e.g. Issue with parking bay camera update in Gokulam"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#163A70] mb-1">
                Detailed Message
              </label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or feedback..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="md">
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

