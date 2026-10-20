// src/components/product/Category.jsx
import React from 'react';
import { Chip } from '@mui/material';

const Category = ({ name }) => (
  <Chip label={name} size="small" sx={{ mr: 0.5, backgroundColor: 'info.main', color: 'white' }} />
);

export default Category;
