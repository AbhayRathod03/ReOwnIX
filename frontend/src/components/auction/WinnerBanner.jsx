import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Trophy, Gavel, XCircle } from 'lucide-react';

/**
 * Displayed when an auction ends.
 * role: 'winner' | 'seller' | 'participant' | 'none'
 */
const WinnerBanner = ({ role = 'none', winnerName, isCurrentUser, winningBid, isSeller }) => {
  // Support legacy isCurrentUser prop
  const resolvedRole = role !== 'none' ? role : (isCurrentUser ? 'winner' : isSeller ? 'seller' : 'participant');

  if (resolvedRole === 'winner') {
    return (
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 3,
          bgcolor: '#fefce8',
          border: '2px solid #fde047',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ fontSize: '2.5rem' }}>🏆</Box>
        <Box>
          <Typography variant="h6" fontWeight={800} color="#a16207">
            Congratulations! You won this auction!
          </Typography>
          {winningBid && (
            <Typography variant="body2" color="#a16207">
              Winning Bid: ₹{Number(winningBid).toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  if (resolvedRole === 'seller') {
    return (
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 3,
          bgcolor: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Gavel size={28} color="#15803d" />
        <Box>
          <Typography variant="h6" fontWeight={700} color="#15803d">
            Your auction has completed
          </Typography>
          {winnerName && (
            <Typography variant="body2" color="#15803d">
              Winner: <strong>{winnerName}</strong>
            </Typography>
          )}
          {winningBid && (
            <Typography variant="body2" color="#15803d">
              Final Price: ₹{Number(winningBid).toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  if (resolvedRole === 'participant') {
    return (
      <Paper
        elevation={0}
        sx={{
          mb: 3, p: 3,
          bgcolor: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <XCircle size={28} color="#b91c1c" />
        <Box>
          <Typography variant="h6" fontWeight={700} color="#b91c1c">
            You did not win this auction
          </Typography>
          {winnerName && (
            <Typography variant="body2" color="#b91c1c">
              Winner: <strong>{winnerName}</strong>
            </Typography>
          )}
          {winningBid && (
            <Typography variant="body2" color="#b91c1c">
              Winning Bid: ₹{Number(winningBid).toLocaleString('en-IN')}
            </Typography>
          )}
        </Box>
      </Paper>
    );
  }

  // 'none' — ended with no bids
  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3, p: 3,
        bgcolor: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Gavel size={24} color="#6b7280" />
      <Box>
        <Typography variant="h6" fontWeight={700} color="text.secondary">
          Auction Ended
        </Typography>
        <Typography variant="body2" color="text.disabled">
          No bids were placed on this auction.
        </Typography>
      </Box>
    </Paper>
  );
};

export default WinnerBanner;
