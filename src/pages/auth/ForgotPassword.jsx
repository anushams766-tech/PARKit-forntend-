import { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { LOGO_PATH } from '../../utils/constants';
import { isValidEmail } from '../../utils/validators';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Please provide a valid registered driver email address');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-24 h-24 mx-auto flex items-center justify-center p-2 rounded-2xl bg-white border border-[#E2E8F0] shadow-md overflow-hidden">
            <img
              src={LOGO_PATH}
              alt="PARKit Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#163A70]">
            Reset Password
          </h1>
          <p className="text-xs text-[#64748B]">
            Enter your registered driver email to receive password reset instructions.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-md">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#163A70]">Reset Link Sent</h3>
              <p className="text-xs text-[#64748B]">
                We have sent an email to <strong className="text-[#172554]">{email}</strong> with instructions to reset your driver password.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {error}
                </div>
              )}

              <Input
                label="Registered Driver Email"
                name="email"
                type="email"
                placeholder="e.g. anusha.driver@parkit.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-extrabold"
              >
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#172554]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
