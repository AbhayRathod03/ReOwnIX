// src/components/product/ListingType.jsx
import React from 'react';
import { Chip } from '@mui/material';

const ListingType = ({ type }) => (
  <Chip
    label={type}
    size="small"
    sx={{ mr: 0.5, backgroundColor: type === 'Auction' ? 'error.main' : 'success.main', color: 'white' }}
  />
);

export default ListingType;
