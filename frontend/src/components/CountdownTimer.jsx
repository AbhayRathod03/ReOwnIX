// src/components/CountdownTimer.jsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

// Helper to calculate remaining time components
const getRemaining = (end) => {
  const now = new Date().getTime();
  const diff = new Date(end).getTime() - now;
  if (diff <= 0) return null;
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
};

const pad = (num) => String(num).padStart(2, '0');

const CountdownTimer = ({ endDate }) => {
  const [remaining, setRemaining] = useState(getRemaining(endDate));

  useEffect(() => {
    if (!endDate) return undefined;
    const interval = setInterval(() => {
      const r = getRemaining(endDate);
      setRemaining(r);
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!remaining) {
    return <Typography variant="caption" color="error">Ended</Typography>;
  }
  const { days, hours, minutes, seconds } = remaining;
  return (
    <Typography variant="caption" color="text.secondary">
      {days > 0 ? `${days}d ` : ''}{pad(hours)}:{pad(minutes)}:{pad(seconds)}
    </Typography>
  );
};

export default CountdownTimer;
