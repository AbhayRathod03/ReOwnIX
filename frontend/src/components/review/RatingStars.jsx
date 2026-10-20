// src/components/review/RatingStars.jsx
import React from 'react';
import { Box } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

/**
 * Star rating component.
 * Props:
 *  - value: number (current rating, 0‑5)
 *  - onChange: function(newValue) (called when user selects a rating)
 *  - readOnly: boolean (if true, stars are not clickable)
 */
const RatingStars = ({ value = 0, onChange, readOnly = false }) => {
  const handleClick = (newVal) => {
    if (!readOnly && onChange) onChange(newVal);
  };

  return (
    <Box display="flex" alignItems="center" sx={{ cursor: readOnly ? 'default' : 'pointer' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          component="span"
          onClick={() => handleClick(i)}
          sx={{ color: i <= value ? 'gold' : 'grey.400', fontSize: 28, mx: 0.25 }}
        >
          {i <= value ? <Star fontSize="inherit" /> : <StarBorder fontSize="inherit" />}
        </Box>
      ))}
    </Box>
  );
};

export default RatingStars;
