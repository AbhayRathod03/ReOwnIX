// src/components/product/Seller.jsx
import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const Seller = ({ name, avatarUrl }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
    <Avatar src={avatarUrl} alt={name} sx={{ width: 32, height: 32, mr: 1 }} />
    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      {name}
    </Typography>
  </Box>
);

export default Seller;
