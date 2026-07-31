import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ErrorBoundary extends (React.Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Caught Error Boundary exception:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-red-400">Something went wrong</h2>
            <p className="text-sm text-slate-300">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-[#0052FF] hover:bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer text-sm"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
