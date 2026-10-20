// src/components/EmptyState.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const EmptyState = ({ title = 'No data available', description }) => (
  <Box sx={{ textAlign: 'center', py: 5 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    {description && <Typography variant="body2" color="text.secondary">{description}</Typography>}
  </Box>
);

export default EmptyState;
