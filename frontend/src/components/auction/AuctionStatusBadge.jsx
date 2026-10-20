import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
  70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
`;

const STATUS_CONFIG = {
  ACTIVE: {
    label: '● LIVE',
    bg: '#dcfce7',
    color: '#15803d',
    border: '#86efac',
    animate: true,
  },
  UPCOMING: {
    label: '⏰ UPCOMING',
    bg: '#fef9c3',
    color: '#a16207',
    border: '#fde047',
    animate: false,
  },
  PENDING: {
    label: '⏰ UPCOMING',
    bg: '#fef9c3',
    color: '#a16207',
    border: '#fde047',
    animate: false,
  },
  ENDED: {
    label: 'Auction Ended',
    bg: '#fee2e2',
    color: '#b91c1c',
    border: '#fca5a5',
    animate: false,
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: '#f3f4f6',
    color: '#6b7280',
    border: '#d1d5db',
    animate: false,
  },
};

const AuctionStatusBadge = ({ status, size = 'medium' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ENDED;
  const isSmall = size === 'small';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: isSmall ? 1 : 1.5,
        py: isSmall ? 0.25 : 0.5,
        bgcolor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 8,
        animation: config.animate ? `${pulse} 2s infinite` : 'none',
      }}
    >
      <Typography
        sx={{
          fontSize: isSmall ? '0.7rem' : '0.8rem',
          fontWeight: 700,
          color: config.color,
          letterSpacing: 0.5,
          lineHeight: 1,
        }}
      >
        {config.label}
      </Typography>
    </Box>
  );
};

export default AuctionStatusBadge;
