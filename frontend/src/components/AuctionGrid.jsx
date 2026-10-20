// src/components/AuctionGrid.jsx
import React from 'react';
import { Box } from '@mui/material';
import AuctionCard from './AuctionCard';

/**
 * Responsive grid for displaying a list of auctions.
 * - Desktop (md and up): 3 columns
 * - Tablet (sm): 2 columns
 * - Mobile (xs): 1 column
 * Uses CSS Grid with 32px gap and centers within a max‑width container.
 */
const AuctionGrid = ({ auctions }) => {
  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: 'auto', // center horizontally
        p: { xs: 2, sm: 3, md: 4 },
        display: 'grid',
        gap: 4, // 32px (theme spacing unit = 8px)
        gridTemplateColumns: {
          xs: '1fr', // mobile
          sm: 'repeat(2, 1fr)', // tablet
          md: 'repeat(3, 1fr)', // desktop
        },
      }}
    >
      {auctions.map((a) => (
        <AuctionCard key={a.id} auction={a} />
      ))}
    </Box>
  );
};

export default AuctionGrid;
