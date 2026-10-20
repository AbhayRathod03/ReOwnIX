// src/components/product/Condition.jsx
import React from 'react';
import { Chip } from '@mui/material';

const formatCondition = (val) => {
  if (!val) return '';
  return val.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const Condition = ({ value }) => (
  <Chip
    label={formatCondition(value)}
    size="small"
    sx={{ mr: 0.5, backgroundColor: 'warning.main', color: 'white' }}
  />
);

export default Condition;
