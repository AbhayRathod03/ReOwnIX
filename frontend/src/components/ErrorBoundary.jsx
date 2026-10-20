// src/components/ErrorBoundary.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h5" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {this.state.error?.toString()}
          </Typography>
          <Button variant="contained" onClick={this.handleReset} sx={{ mt: 2 }}>
            Try Again
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
