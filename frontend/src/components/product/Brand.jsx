// src/components/product/Brand.jsx
import React from 'react';
import { Chip } from '@mui/material';

const Brand = ({ name }) => (
  <Chip label={name} size="small" sx={{ mr: 0.5, backgroundColor: 'secondary.main', color: 'white' }} />
);

export default Brand;
