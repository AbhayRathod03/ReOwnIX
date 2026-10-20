import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import offerApi from '../services/offerApi';
import OfferCard from '../components/offer/OfferCard';
import toast from 'react-hot-toast';

const ProductOffers = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, [productId]);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const data = await offerApi.getProductOffers(productId);
      setOffers(data || []);
    } catch (err) {
      console.error('Failed to load product offers', err);
      toast.error('Could not load offers');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (offerId, status) => {
    try {
      await offerApi.updateOfferStatus(offerId, status);
      toast.success(`Offer ${status.toLowerCase()} successfully`);
      // Update local state
      setOffers(offers.map(o => o.id === offerId ? { ...o, status } : o));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update offer status');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/profile/my-products')} sx={{ mr: 2 }}>
          <ArrowLeft />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Offers for Product
        </Typography>
      </Box>

      {offers.length === 0 ? (
        <Typography color="text.secondary">No offers received for this product yet.</Typography>
      ) : (
        offers.map((offer) => (
          <OfferCard 
            key={offer.id} 
            offer={offer} 
            isSeller={true} 
            onUpdateStatus={handleUpdateStatus}
          />
        ))
      )}
    </Box>
  );
};

export default ProductOffers;
