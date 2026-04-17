import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      
      try {
        // Check if it's a Firestore JSON error
        if (this.state.error?.message.startsWith('{')) {
          const errInfo = JSON.parse(this.state.error.message);
          if (errInfo.error.includes('Missing or insufficient permissions')) {
            errorMessage = "You don't have permission to access this data. Please ensure you are logged in as an admin.";
          }
        }
      } catch (e) {
        // Fallback to default message
      }

      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-white/10 p-10 rounded-[40px] soft-shadow text-center space-y-6">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">System Error</h2>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-zinc-900 transition-all active:scale-95 soft-shadow"
            >
              <RefreshCcw size={18} /> Restart System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
