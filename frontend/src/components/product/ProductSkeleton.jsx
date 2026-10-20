// src/components/product/ProductSkeleton.jsx
import React from 'react';
import { Card, CardContent, CardActions, Box, Skeleton } from '@mui/material';

/**
 * ProductSkeleton mimics the shape of ProductCard while data is loading.
 */
const ProductSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" width="80%" height={28} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, my: 1 }}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Box>
      <Skeleton variant="text" width="40%" height={24} />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Skeleton variant="circular" width={32} height={32} />
      <Skeleton variant="text" width="30%" height={20} />
    </CardActions>
  </Card>
);

export default ProductSkeleton;
