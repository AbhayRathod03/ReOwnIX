// src/components/product/Title.jsx
import React from 'react';
import { Typography } from '@mui/material';

const Title = ({ text }) => (
  <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
    {text}
  </Typography>
);

export default Title;
