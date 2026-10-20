// src/layouts/DashboardLayout.jsx
import React from 'react';
import { Box } from '@mui/material';

/**
 * Simple layout for the seller dashboard.
 * No left sidebar – the navigation lives as tabs below the header.
 * Provides a light background and ensures the content takes the full height.
 */
const DashboardLayout = ({ children }) => (
  <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC' }}>
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: 4 }}>
      {children}
    </Box>
  </Box>
);

export default DashboardLayout;
