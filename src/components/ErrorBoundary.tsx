import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    console.error('Component:', this.props.componentName || 'Unknown');
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 m-4">
          <div className="text-red-400 text-sm">
            <h3 className="font-semibold mb-2">Something went wrong</h3>
            <p className="text-red-300">
              {this.props.componentName ? `The ${this.props.componentName} component` : 'This component'} 
              {' '}encountered an error and couldn't render properly.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false, error: undefined })}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}