// src/components/common/SkeletonBox.jsx
import React from 'react';
import { Skeleton } from '@mui/material';
/**
 * Reusable Skeleton placeholder.
 * Props:
 *   width, height – CSS values (e.g., '100%', 200)
 *   variant – 'text' | 'rectangular' | 'circular'
 *   animation – 'pulse' | 'wave' (default 'wave')
 */
const SkeletonBox = ({ width = '100%', height = '100%', variant = 'rectangular', animation = 'wave', ...rest }) => (
  <Skeleton
    variant={variant}
    animation={animation}
    width={width}
    height={height}
    {...rest}
  />
);

export default SkeletonBox;
