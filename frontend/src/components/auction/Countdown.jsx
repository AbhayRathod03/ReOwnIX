import React, { useState, useEffect } from 'react';
import { Typography, Box, keyframes } from '@mui/material';

const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const Countdown = ({ endTime, status, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState('normal'); // 'normal', 'warning', 'critical', 'ended'

  useEffect(() => {
    if (status === 'ENDED' || status === 'CANCELLED') {
      setUrgency('ended');
      setTimeLeft('Ended');
      return;
    }

    const calculateTimeLeft = () => {
      if (!endTime) return '';
      const difference = new Date(endTime) - new Date();
      if (difference <= 0) {
        setUrgency('ended');
        return 'Ended';
      }
      
      if (difference < 60 * 1000) {
        setUrgency('critical');
      } else if (difference < 5 * 60 * 1000) {
        setUrgency('warning');
      } else {
        setUrgency('normal');
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const m = Math.floor((difference / 1000 / 60) % 60);
      const s = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (d > 0) parts.push(`${d}d`);
      if (h > 0 || d > 0) parts.push(`${String(h).padStart(2, '0')}h`);
      parts.push(`${String(m).padStart(2, '0')}m`);
      parts.push(`${String(s).padStart(2, '0')}s`);

      return parts.join(' ');
    };

    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    
    if (initialTime === 'Ended' && onFinish) {
      onFinish();
    }

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (newTime === 'Ended') {
        clearInterval(timer);
        if (onFinish) onFinish();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, status, onFinish]);

  const getColor = () => {
    if (urgency === 'ended') return 'text.secondary';
    if (urgency === 'critical') return 'error.main';
    if (urgency === 'warning') return 'warning.main';
    return '#10b981'; // Green for normal
  };

  return (
    <Box 
      sx={{ 
        color: getColor(), 
        fontWeight: 'bold',
        animation: urgency === 'critical' ? `${pulseAnimation} 1s infinite ease-in-out` : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        px: 1.5,
        py: 0.5,
        borderRadius: 2,
        bgcolor: urgency === 'critical' ? 'rgba(211, 47, 47, 0.1)' : (urgency === 'warning' ? 'rgba(237, 108, 2, 0.1)' : 'rgba(16, 185, 129, 0.1)'),
      }}
    >
      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800 }}>
        {timeLeft || 'Calculating...'}
      </Typography>
    </Box>
  );
};

export default Countdown;
