import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Button from './Button';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('PARKit Application Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem('parkit_sample_mode');
      localStorage.removeItem('parkit_sample_profile_id');
      localStorage.removeItem('parkit_user_sessions');
      localStorage.removeItem('parkit_user_payments');
    } catch (e) {
      // ignore
    }
    window.location.href = '/home';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#172554] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-2xl border border-[#CBD5E1] shadow-lg text-center space-y-5 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-extrabold text-[#163A70]">
                Application Display Recovered
              </h2>
              <p className="text-xs text-[#64748B] leading-relaxed">
                An unexpected rendering issue was prevented from interrupting your session. You can reload the view or return to the main dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left font-mono text-[11px] text-[#64748B] overflow-x-auto max-h-32">
                <strong className="text-rose-600 block mb-1">Details:</strong>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Application</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={this.handleResetState}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

