import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, CircularProgress, Chip, Button } from '@mui/material';
import { Gavel, Clock, ArrowRight } from 'lucide-react';
import auctionApi from '../services/auctionApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyBids();
  }, []);

  const fetchMyBids = async () => {
    try {
      setLoading(true);
      const data = await auctionApi.getMyBids();
      setBids(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch your bids');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Gavel /> My Bids
      </Typography>

      {bids.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 8, borderRadius: 3 }} elevation={0}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't placed any bids yet.
          </Typography>
          <Button component={Link} to="/products" variant="contained" sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}>
            Browse Auctions
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bids.map((bid, index) => (
            <Grid item xs={12} md={6} key={bid.id || index}>
              <Paper 
                sx={{ 
                  p: 3, 
                  borderRadius: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 4 }
                }} 
                elevation={0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Bid #{bid.id}
                  </Typography>
                  <Chip label="Placed" color="primary" size="small" />
                </Box>
                
                <Typography variant="h4" color="primary.main" fontWeight="800" sx={{ mb: 2 }}>
                  ₹{bid.amount?.toLocaleString()}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 3 }}>
                  <Clock size={16} />
                  <Typography variant="body2">
                    {formatDate(bid.bidTime)}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Button
                    variant="text"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}
                    // Note: We don't have the auction ID associated with the bid in BidResponse!
                    // If backend updates it, we can link to the auction here.
                    disabled
                  >
                    View Auction
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyBids;
