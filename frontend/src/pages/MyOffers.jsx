import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Tabs, Tab, Grid, Paper } from '@mui/material';
import offerApi from '../services/offerApi';
import productApi from '../services/productApi';
import OfferCard from '../components/offer/OfferCard';
import toast from 'react-hot-toast';

const MyOffers = () => {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(0);
  
  const [sentOffers, setSentOffers] = useState([]);
  const [receivedOffers, setReceivedOffers] = useState([]);

  useEffect(() => {
    fetchAllOffers();
  }, []);

  const fetchAllOffers = async () => {
    setLoading(true);
    try {
      // 1. Fetch offers sent by me (Buyer)
      const myOffersData = await offerApi.getMyOffers().catch(() => []);
      setSentOffers(myOffersData || []);

      // 2. Fetch offers received by me (Seller)
      // Since there's no global "getReceivedOffers" endpoint, we fetch all my products and then fetch offers for each.
      const myProducts = await productApi.getMyProducts().catch(() => []);
      
      const receivedPromises = (myProducts || []).map(p => 
        offerApi.getProductOffers(p.id).catch(() => [])
      );
      
      const receivedResults = await Promise.all(receivedPromises);
      // Flatten the array of arrays
      const allReceived = receivedResults.flat();
      setReceivedOffers(allReceived);

    } catch (err) {
      console.error('Failed to load offers', err);
      toast.error('Could not load all offers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (offer, status) => {
    try {
      await offerApi.updateOfferStatus(offer.id, status);
      toast.success(`Offer ${status.toLowerCase()} successfully`);
      fetchAllOffers();
    } catch (err) {
      toast.error('Failed to update offer');
    }
  };

  const pendingReceived = receivedOffers.filter(o => o.status === 'PENDING');
  const pendingSent = sentOffers.filter(o => o.status === 'PENDING');
  
  // For resolved tabs, we combine both sent and received
  const acceptedOffers = [...receivedOffers, ...sentOffers].filter(o => o.status === 'ACCEPTED');
  const rejectedOffers = [...receivedOffers, ...sentOffers].filter(o => o.status === 'REJECTED');

  const getFilteredOffers = () => {
    switch (tab) {
      case 0: return pendingReceived;
      case 1: return pendingSent;
      case 2: return acceptedOffers;
      case 3: return rejectedOffers;
      default: return [];
    }
  };

  const currentOffers = getFilteredOffers();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>
        Offer Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track offers you've received on your products and offers you've made to others.
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label={`Action Required (${pendingReceived.length})`} />
        <Tab label={`Sent by Me (${pendingSent.length})`} />
        <Tab label={`Accepted (${acceptedOffers.length})`} />
        <Tab label={`Rejected (${rejectedOffers.length})`} />
      </Tabs>

      {currentOffers.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50', borderRadius: 4, border: '1px dashed', borderColor: 'divider' }} elevation={0}>
          <Typography variant="h6" color="text.secondary" fontWeight="bold">
            No offers found in this category.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {currentOffers.map(offer => {
            // Determine if the current user is the seller of this offer
            const isSeller = receivedOffers.some(ro => ro.id === offer.id);
            return (
              <Grid item xs={12} md={6} lg={4} key={offer.id}>
                <OfferCard 
                  offer={offer} 
                  isSeller={isSeller} 
                  onStatusUpdate={handleStatusUpdate}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default MyOffers;
