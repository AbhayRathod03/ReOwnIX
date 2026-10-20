// src/components/product/EmptyProducts.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingFlat } from '@mui/icons-material';

/**
 * EmptyProducts displays a friendly message when there are no products to show.
 */
const EmptyProducts = ({ message = 'No products found.' }) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      color: 'text.secondary',
    }}
  >
    <TrendingFlat sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
    <Typography variant="h6" sx={{ fontWeight: 500 }}>
      {message}
    </Typography>
  </Box>
);

export default EmptyProducts;
