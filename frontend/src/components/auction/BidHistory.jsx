import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography, Divider, Chip } from '@mui/material';
import { Gavel, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (dt) => {
  if (!dt) return '';
  return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const BidHistory = ({ bids = [], isEnded = false, currentUserId }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Only scroll the internal container, not the entire browser window
      containerRef.current.scrollTop = 0;
    }
  }, [bids.length]);

  // Sort: highest amount first (backend already does this, but ensure)
  const sorted = [...bids].sort((a, b) => Number(b.amount) - Number(a.amount));

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Gavel size={20} color="#2563EB" />
        <Typography variant="h6" fontWeight={700}>Bid History</Typography>
        <Chip label={`${bids.length} bid${bids.length !== 1 ? 's' : ''}`} size="small" sx={{ ml: 'auto', bgcolor: '#eff6ff', color: '#2563EB', fontWeight: 600 }} />
      </Box>
      <Divider sx={{ mb: 2 }} />

      {sorted.length === 0 ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary" fontSize="0.9rem">No bids yet. Be the first!</Typography>
        </Box>
      ) : (
        <Box ref={containerRef} sx={{ maxHeight: 500, overflowY: 'auto', pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 8 } }}>
          <AnimatePresence initial={false}>
            {sorted.map((bid, index) => {
              const isWinning = index === 0;
              // Handle both REST response (bidderName) and WS broadcast (bidderName) fields
              const rawName = bid.bidderName || bid.name || 'Unknown';
              const isCurrentUser = currentUserId && String(bid.bidderId || (bid.bidder && bid.bidder.id)) === String(currentUserId);
              const name = isCurrentUser ? 'YOU' : rawName;
              
              const amount = bid.amount || bid.bidAmount || 0;
              const time = bid.bidTime || bid.timestamp;
              const initials = isCurrentUser ? 'YOU' : name.substring(0, 2).toUpperCase();

              return (
                <motion.div
                  key={bid.id || `${amount}-${time}-${index}`}
                  initial={{ opacity: 0, y: -20, backgroundColor: '#fef3c7' }}
                  animate={{ opacity: 1, y: 0, backgroundColor: isWinning ? 'rgba(37, 99, 235, 0.05)' : '#ffffff' }}
                  transition={{ duration: 0.4 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      px: 3,
                      mb: 1.5,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: isWinning ? 'primary.light' : (isCurrentUser ? 'success.light' : 'divider'),
                      transition: 'all 0.3s',
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box sx={{ 
                        width: 40, height: 40, borderRadius: '50%', 
                        bgcolor: isWinning ? 'primary.main' : (isCurrentUser ? 'success.main' : 'grey.200'), 
                        color: isWinning || isCurrentUser ? 'white' : 'text.secondary',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: isCurrentUser ? '0.7rem' : '0.9rem'
                      }}>
                        {initials}
                      </Box>
                      <Box>
                        <Typography variant="body1" fontWeight={isCurrentUser ? 800 : 700} color={isCurrentUser ? 'success.main' : 'text.primary'}>
                          {name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(time)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {isWinning && (
                        <Chip 
                          icon={<Trophy size={14} color="#2563EB" />} 
                          label="Highest Bid" 
                          size="small" 
                          sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', color: 'primary.main', fontWeight: 700, '& .MuiChip-icon': { ml: 1 } }} 
                        />
                      )}
                      <Typography variant="h6" fontWeight={800} color={isWinning ? 'primary.main' : 'text.primary'}>
                        ₹{Number(amount).toLocaleString('en-IN')}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      )}
    </Paper>
  );
};

export default BidHistory;
