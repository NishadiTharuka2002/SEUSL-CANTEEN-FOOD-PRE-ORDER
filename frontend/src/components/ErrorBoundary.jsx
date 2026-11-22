import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ maxWidth: '600px', marginTop: '60px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '40px 24px', border: '1px solid #fed7aa', background: '#fffbeb' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309', marginBottom: '12px' }}>
              Notice: Page Refresh Required
            </h2>
            <p style={{ color: '#78350f', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
              The system encountered a minor sync update. Click the button below to reload cleanly.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{ padding: '10px 24px' }}
              >
                Reload Page
              </button>
              <a
                href="/menu"
                className="btn btn-secondary"
                style={{ padding: '10px 24px' }}
              >
                Go to Menu
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
