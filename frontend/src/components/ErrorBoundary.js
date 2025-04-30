import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          backgroundColor: '#fff3f3', 
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          color: '#b71c1c'
        }}>
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 