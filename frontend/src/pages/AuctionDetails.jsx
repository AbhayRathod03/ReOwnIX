import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Paper, Typography, Avatar, CircularProgress, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Divider, Stack } from '@mui/material';
import { Gavel, Clock, Trophy, ArrowLeft } from 'lucide-react';
import auctionApi from '../services/auctionApi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuctionDetails = () => {
  const { id } = useParams(); // URL parameter is now id
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);

  // Poll for auction details
  useEffect(() => {
    let interval;
    const fetchAuction = async () => {
      if (!id) return;
      if (document.hidden) return; // Pause polling when hidden
      try {
        const auctionData = await auctionApi.getAuctionDetails(id);
        setAuction(auctionData);
        setBids(auctionData.bids || []);
      } catch (err) {
        console.error('Failed to fetch auction', err);
        toast.error('Failed to load auction data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAuction();
    interval = setInterval(fetchAuction, 5000); // Polling every 5 seconds for live bidding
    return () => clearInterval(interval);
  }, [id]);

  const handlePlaceBid = async () => {
    const amount = Number(bidAmount);
    if (!amount || amount < (auction?.currentPrice + auction?.minimumBidIncrement)) {
      toast.error(`Minimum bid is ₹${(auction?.currentPrice + auction?.minimumBidIncrement).toLocaleString()}`);
      return;
    }
    
    setSubmittingBid(true);
    try {
      await auctionApi.placeBid(id, { amount });
      toast.success('Bid placed successfully!');
      setBidModalOpen(false);
      setBidAmount('');
      // Optimistically fetch immediately
      const updated = await auctionApi.getAuctionDetails(id);
      setAuction(updated);
      setBids(updated.bids || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  // Countdown timer logic
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!auction?.endTime) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Auction Ended');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!auction) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6" color="text.secondary">Auction not found</Typography>
      </Box>
    );
  }

  const isEnded = auction.status === 'ENDED';
  const minRequiredBid = auction.currentPrice + auction.minimumBidIncrement;

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: { xs: 2, md: 4 } }}>
      <Button component={Link} to={auction.productId ? `/products/${auction.productId}` : '/products'} startIcon={<ArrowLeft size={18} />} sx={{ mb: 3, textTransform: 'none' }}>
        Back to Product
      </Button>

      <Grid container spacing={4}>
        {/* Left Column (Image & Bids) */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Box 
              component="img"
              src={auction.productThumbnail || '/default-product.png'}
              alt={auction.productTitle}
              sx={{ width: '100%', height: 400, objectFit: 'cover' }}
            />
          </Paper>

          {/* Live Bids */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Gavel size={20} /> Bid History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {bids.length === 0 ? (
              <Typography color="text.secondary">No bids yet. Be the first!</Typography>
            ) : (
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {[...bids].reverse().map((bid) => (
                  <ListItem key={bid.id} sx={{ px: 0, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <ListItemText 
                      primary={<Typography fontWeight="bold">₹{bid.amount.toLocaleString()}</Typography>}
                      secondary={new Date(bid.bidTime).toLocaleString()}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {bid.bidderName}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Right Column (Details & Action) */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, position: 'sticky', top: 20 }}>
            
            {isEnded && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1, color: '#ef4444' }}>
                <Trophy size={24} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Auction Ended</Typography>
                  <Typography variant="body2">Winner: {auction.winnerName || 'No Winner'}</Typography>
                </Box>
              </Box>
            )}

            <Typography variant="h4" fontWeight="800" sx={{ mb: 1 }}>
              {auction.productTitle}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Sold by <strong>{auction.sellerName}</strong>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" letterSpacing={1}>
                  Current Bid
                </Typography>
                <Typography variant="h3" fontWeight="900" color="primary.main">
                  ₹{auction.currentPrice.toLocaleString()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Clock size={24} color={isEnded ? 'grey' : '#f59e0b'} />
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Time Left</Typography>
                  <Typography variant="h6" fontWeight="bold" color={isEnded ? 'text.secondary' : 'text.primary'}>
                    {timeLeft || 'Calculating...'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {isEnded ? (
              <Button 
                variant="contained" 
                size="large" 
                fullWidth 
                disabled
                sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 2 }}
              >
                Auction Closed
              </Button>
            ) : (
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }}>
                  Place your bid
                </Typography>
                <TextField 
                  fullWidth
                  placeholder={`Min bid: ₹${minRequiredBid.toLocaleString()}`}
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  InputProps={{ 
                    inputProps: { min: minRequiredBid },
                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary', fontWeight: 600 }}>₹</Typography>
                  }}
                  variant="outlined"
                  sx={{ 
                    mb: 2, 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      bgcolor: '#F8FAFC'
                    } 
                  }}
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  fullWidth 
                  onClick={handlePlaceBid}
                  disabled={submittingBid || !bidAmount || Number(bidAmount) < minRequiredBid}
                  sx={{ 
                    py: 1.8, 
                    fontSize: '1.05rem', 
                    fontWeight: 700, 
                    borderRadius: 2, 
                    background: 'linear-gradient(to right, #1D4ED8 0%, #3B82F6 100%)', 
                    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                    textTransform: 'none'
                  }}
                >
                  {submittingBid ? 'Submitting...' : 'Confirm Bid'}
                </Button>
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                  Enter ₹{minRequiredBid.toLocaleString()} or more
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};

export default AuctionDetails;
