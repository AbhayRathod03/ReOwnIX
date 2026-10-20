import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import { Gavel } from 'lucide-react';

import { CircularProgress } from '@mui/material';

const BidInput = ({ disabled, disabledReason, currentPrice, minIncrement, onPlaceBid, isWinning }) => {
  const minBid = Number(currentPrice || 0) + Number(minIncrement || 1);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-adjust if minBid jumps higher than current input
  useEffect(() => {
    if (amount && Number(amount) < minBid) {
      setAmount(minBid.toString());
    }
  }, [minBid, amount]);

  const handleSubmit = () => {
    const val = Number(amount);
    if (!val || val < minBid) return;
    setIsSubmitting(true);
    onPlaceBid(val);
    // STOMP is fast, but we clear it after a short delay
    setTimeout(() => {
      setAmount('');
      setIsSubmitting(false);
    }, 500);
  };

  if (isWinning) {
    return (
      <Box sx={{ 
        bgcolor: 'rgba(16, 185, 129, 0.08)', 
        border: '1px solid rgba(16, 185, 129, 0.3)', 
        borderRadius: 4, 
        p: 3, 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1.5
      }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, bgcolor: '#10B981', color: 'white', px: 2, py: 0.5, borderRadius: 10 }}>
          <Typography variant="caption" fontWeight="800">🟢 YOU ARE CURRENTLY WINNING</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" fontWeight="600">Current Highest Bid</Typography>
        <Typography variant="h4" fontWeight="900" color="#10B981">
          ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
        </Typography>
        <Typography variant="caption" color="text.secondary" fontWeight="500">Waiting for another bidder...</Typography>
      </Box>
    );
  }

  if (disabled) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Button
          variant="outlined"
          fullWidth
          disabled
          startIcon={<Gavel size={18} />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 700, fontSize: '1rem' }}
        >
          {disabledReason || 'Auction Closed'}
        </Button>
        {disabledReason && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
            {disabledReason}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" fontWeight="700" textTransform="uppercase">
        Minimum Next Bid: ₹{minBid.toLocaleString('en-IN')}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {[500, 1000, 5000, 10000].map(inc => (
          <Button 
            key={inc}
            variant="outlined" 
            size="small"
            onClick={() => setAmount(minBid + inc)}
            sx={{ borderRadius: 6, fontWeight: 700, borderColor: 'grey.300', color: 'text.primary', '&:hover': { bgcolor: 'primary.50', borderColor: 'primary.main', color: 'primary.main' } }}
          >
            +₹{inc.toLocaleString('en-IN')}
          </Button>
        ))}
      </Box>

      <TextField
        fullWidth
        type="number"
        placeholder="Enter Bid Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">
            <Typography fontWeight="800" color="text.primary">₹</Typography>
          </InputAdornment>,
          inputProps: { min: minBid },
        }}
        variant="outlined"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            bgcolor: '#F8FAFC',
            fontSize: '1.1rem',
            fontWeight: 700
          }
        }}
      />
      
      <Button
        variant="contained"
        fullWidth
        size="large"
        disabled={!amount || Number(amount) < minBid || isSubmitting}
        onClick={handleSubmit}
        sx={{ 
          py: 2, 
          borderRadius: 3, 
          fontWeight: 800, 
          fontSize: '1.1rem', 
          textTransform: 'none',
          background: (!amount || Number(amount) < minBid || isSubmitting) ? 'grey.300' : 'linear-gradient(to right, #1D4ED8 0%, #3B82F6 100%)',
          boxShadow: (!amount || Number(amount) < minBid || isSubmitting) ? 'none' : '0 8px 24px rgba(37, 99, 235, 0.25)',
        }}
      >
        {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Place Bid'}
      </Button>
    </Box>
  );
};

export default BidInput;
