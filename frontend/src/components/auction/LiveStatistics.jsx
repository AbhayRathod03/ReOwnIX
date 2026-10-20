import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';
import { TrendingUp, Users, Clock, Gavel, Eye, Banknote } from 'lucide-react';
import Countdown from './Countdown';

const StatBox = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', p: 3, bgcolor: '#ffffff', borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <Box sx={{ p: 1, bgcolor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB', borderRadius: 2, display: 'flex' }}>
        {icon}
      </Box>
      <Typography variant="caption" color="text.secondary" fontWeight="700" textTransform="uppercase">
        {label}
      </Typography>
    </Box>
    <Typography variant="h5" fontWeight="900" color="text.primary">
      {value}
    </Typography>
  </Box>
);

const LiveStatistics = ({ auction, bids }) => {
  if (!auction) return null;

  // Calculate unique participants by ID or name
  const uniqueParticipants = new Set(bids.map(b => b.bidderId || (b.bidder && b.bidder.id) || b.bidderName || b.name)).size;
  // Mock watching based on ID for consistency if not provided
  const watching = auction.viewCount || (Number(auction.id) * 3 + 42) % 200 + 50;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TrendingUp size={20} /> Live Statistics
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2 }}>
        <StatBox 
          icon={<Banknote size={18} />} 
          label="Current Bid" 
          value={`₹${Number(auction.currentPrice).toLocaleString('en-IN')}`} 
        />
        <StatBox 
          icon={<Gavel size={18} />} 
          label="Total Bids" 
          value={bids.length} 
        />
        <StatBox 
          icon={<Users size={18} />} 
          label="Participants" 
          value={uniqueParticipants} 
        />
        <StatBox 
          icon={<Eye size={18} />} 
          label="Watching" 
          value={watching} 
        />
        <StatBox 
          icon={<Clock size={18} />} 
          label="Ends In" 
          value={<Countdown endTime={auction.endTime} status={auction.status} />} 
        />
      </Box>
    </Box>
  );
};

export default LiveStatistics;
