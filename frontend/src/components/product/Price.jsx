// src/components/product/Price.jsx
import React from 'react';
import { Typography } from '@mui/material';

const Price = ({ amount, currency = '$' }) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main' }}>
    {currency}{amount?.toLocaleString()}
  </Typography>
);

export default Price;
