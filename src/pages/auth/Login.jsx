import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { LOGO_PATH } from '../../utils/constants';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleNotice, setShowGoogleNotice] = useState(false);
  const [gisLoaded, setGisLoaded] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Clean up any deprecated legacy OAuth URL fragments (#access_token=...)
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // Initialize modern Google Identity Services (GIS) Credential (ID Token) Flow
  useEffect(() => {
    if (!googleClientId) return;

    const setupGis = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnRef.current) {
            googleBtnRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnRef.current, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: 360,
            });
          }
        } catch (e) {
          console.warn('Google Identity Services initialization warning:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      setupGis();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          setupGis();
        }
      }, 150);
      return () => clearInterval(timer);
    }
  }, [googleClientId]);

  // Handle GIS Credential Response (ID Token Verification with FastAPI Backend)
  const handleGoogleCredentialResponse = async (response) => {
    if (!response?.credential) {
      setError('No Google authentication credential received. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send the signed ID Token to FastAPI backend for cryptographic verification
      const result = await authService.verifyGoogleCredential(response.credential);
      const { user: backendUser, token, is_new_user: isNewUser } = result.data;

      // Save authenticated user in existing AuthContext
      loginWithGoogle(backendUser, token);

      // Routing: New users (or incomplete onboarding) -> onboarding flow; Existing users -> dashboard
      if (isNewUser || !backendUser.onboardingComplete) {
        navigate('/location-permission', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    } catch (err) {
      // Display genuine backend verification error without simulation or bypass
      setError(err.message || 'Google authentication failed during backend verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualGoogleClick = () => {
    if (!googleClientId) {
      setShowGoogleNotice(true);
      return;
    }
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setError('Google Identity Services is initializing. Please try again in a few seconds.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your driver email address and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      // After login, proceed to location permission before opening dashboard
      navigate('/location-permission', { replace: true });
    } catch (err) {
      setError('Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full space-y-6">
        {/* PARKit Logo Container */}
        <div className="text-center space-y-2">
          <div className="w-24 h-24 mx-auto flex items-center justify-center p-2 rounded-2xl bg-white border border-[#CBD5E1] shadow-xs overflow-hidden">
            <img
              src={LOGO_PATH}
              alt="PARKit Official Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#163A70]">
            Find it. Park it. Move on.
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] font-medium">
            Sign in to discover and park in nearby registered spaces
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-1">
                <span className="font-bold block">Authentication Notice</span>
                <span className="leading-relaxed block">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. driver@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-[#163A70] mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white border border-[#CBD5E1] text-[#172554] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#163A70] cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-[#64748B]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span>Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[#2563EB] hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-bold shadow-md shadow-blue-500/20"
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-[#64748B] font-medium">Or</span>
            </div>
          </div>

          {/* Google Identity Services (GIS) Button Container */}
          <div className="w-full flex flex-col items-center justify-center">
            {googleClientId ? (
              <div className="w-full flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} className="w-full flex justify-center" />
              </div>
            ) : null}

            {/* Fallback button when GIS is loading or not yet rendered */}
            {(!gisLoaded || !googleClientId) && (
              <button
                type="button"
                onClick={handleManualGoogleClick}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl text-xs font-bold text-[#163A70] bg-[#F8FAFC] hover:bg-[#EFF6FF] border border-[#CBD5E1] transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}
          </div>
        </div>

        {/* Create Account Option */}
        <p className="text-center text-xs text-[#64748B]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563EB] font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>

      {/* Google OAuth Modal */}
      <Modal
        isOpen={showGoogleNotice}
        onClose={() => setShowGoogleNotice(false)}
        title="Google Authentication"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#64748B] leading-relaxed">
            Google OAuth requires a genuine client identifier. To enable direct Google Sign-In, configure <code className="bg-slate-100 px-1 py-0.5 rounded text-[#2563EB]">VITE_GOOGLE_CLIENT_ID</code> in your environment variables.
          </p>
          <p className="text-[#64748B] leading-relaxed">
            In this prototype, please sign in using your email address and password above.
          </p>
          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowGoogleNotice(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
