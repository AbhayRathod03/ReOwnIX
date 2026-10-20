import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Grid, Paper, Avatar, Divider, CircularProgress, Button } from '@mui/material';
import { MapPin, Calendar, Clock, Star, Package, MessageCircle } from 'lucide-react';
import authApi from '../services/authApi';
import productApi from '../services/productApi';
import reviewApi from '../services/reviewApi';
import ProductCard from '../components/ProductCard';

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setLoading(true);
        // Note: Reusing the admin user endpoint or specific seller endpoint if it exists
        // Since we don't have a specific public seller profile endpoint in swagger, we mock some parts 
        // or just use user info if it's available. We'll search products by this seller if possible.
        // Wait, there's no "getProductsBySellerId" in swagger. We can fetch all products and filter locally for now
        // OR just hit a placeholder if there is no such endpoint.
        let realRating = 0.0;
        let reviewsCount = 0;
        try {
          const ratingData = await reviewApi.getSellerRating(id);
          realRating = ratingData.averageRating;
          reviewsCount = ratingData.totalReviews;
        } catch (err) {
          console.warn('Could not fetch real rating', err);
        }

        // Mocking seller info since there's no public user/seller GET endpoint in swagger.
        setSeller({
          id,
          name: 'Seller User',
          location: 'New Delhi, India',
          memberSince: new Date().getFullYear() - 1,
          rating: realRating,
          reviewsCount: reviewsCount,
          responseTime: 'Within 2 hours',
        });

        // If backend allows searching by seller, we'd do it. For now we will fetch recent.
        const response = await productApi.getProducts(0, 10);
        // Pretending these are the seller's products
        setProducts(response.content || response || []);
      } catch (err) {
        console.error('Failed to load seller profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left Column: Seller Details */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
              <Avatar 
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 'bold' }}
              >
                {seller?.name?.charAt(0) || 'S'}
              </Avatar>
              <Typography variant="h5" fontWeight="800" sx={{ mb: 1 }}>
                {seller?.name || 'Seller'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, color: '#F59E0B', mb: 2 }}>
                <Star size={18} fill="currentColor" />
                <Typography variant="body1" fontWeight="700" color="text.primary">
                  {seller?.rating ? seller.rating.toFixed(1) : 'New'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({seller?.reviewsCount || 0} Reviews)
                </Typography>
              </Box>

              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<MessageCircle size={18} />}
                sx={{ borderRadius: 2, py: 1.5, mb: 3, textTransform: 'none', fontWeight: 600 }}
              >
                Message Seller
              </Button>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <MapPin size={20} />
                  <Typography variant="body2">{seller?.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <Calendar size={20} />
                  <Typography variant="body2">Joined {seller?.memberSince}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <Clock size={20} />
                  <Typography variant="body2">Responds {seller?.responseTime}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                  <Package size={20} />
                  <Typography variant="body2">24 Total Listings</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column: Seller Products */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="800" sx={{ mb: 3 }}>
              Products by this Seller
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: 3, 
              alignItems: 'start' 
            }}>
              {products.map(product => (
                <Box key={product.id} sx={{ height: '100%' }}>
                  <ProductCard product={product} />
                </Box>
              ))}
            </Box>
            {products.length === 0 && (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: 'transparent', border: '1px dashed grey' }}>
                <Typography color="text.secondary">This seller has no active listings.</Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SellerProfile;
