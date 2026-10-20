import React from 'react';
import { Box, Typography } from '@mui/material';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserBidStatus = ({ currentUserId, bids, status }) => {
  if (!currentUserId || !bids || bids.length === 0 || status === 'ENDED' || status === 'CANCELLED') {
    return null;
  }

  const highestBid = bids[0];
  const highestBidderId = highestBid.bidderId || (highestBid.bidder && highestBid.bidder.id);
  
  // If the user hasn't bid at all, we might not show anything, or we could show "You haven't bid yet."
  // But let's only show status if they have at least one bid in the history.
  const hasUserBid = bids.some(b => String(b.bidderId || (b.bidder && b.bidder.id)) === String(currentUserId));
  
  if (!hasUserBid) return null;

  const isHighest = String(highestBidderId) === String(currentUserId);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isHighest ? 'highest' : 'outbid'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
      >
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              borderRadius: 3, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              bgcolor: isHighest ? 'success.main' : 'error.main',
              color: 'white',
              boxShadow: isHighest ? '0 4px 14px rgba(46, 125, 50, 0.4)' : '0 4px 14px rgba(211, 47, 47, 0.4)'
            }}
          >
            {isHighest ? <CheckCircle2 size={24} color="white" /> : <AlertTriangle size={24} color="white" />}
            <Typography variant="body1" fontWeight="800" letterSpacing={0.5}>
              {isHighest ? '🟢 YOU ARE WINNING' : '⚠ YOU HAVE BEEN OUTBID!'}
            </Typography>
          </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserBidStatus;
