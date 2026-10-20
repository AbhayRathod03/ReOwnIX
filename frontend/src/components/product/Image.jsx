// src/components/product/Image.jsx
import React from 'react';
import { Box } from '@mui/material';

const Image = ({ src, alt, ...props }) => (
  <Box
    component="img"
    src={src}
    alt={alt}
    sx={{
      width: '100%',
      height: 200,
      objectFit: 'cover',
      borderRadius: 1,
    }}
    {...props}
  />
);

export default Image;
