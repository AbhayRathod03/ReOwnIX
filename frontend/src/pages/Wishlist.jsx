// src/pages/Wishlist.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import wishlistApi from '../services/wishlistApi';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

/**
 * Wishlist page – displays all products saved by the current user.
 * If the user is not authenticated, a toast prompts them to log in.
 */
const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      toast.info('Please log in to view your wishlist');
      setLoading(false);
      return;
    }
    try {
      const data = await wishlistApi.get(); // returns array of products
      setItems(data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
      toast.error('Could not load wishlist');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
    // Re‑fetch when the user changes (e.g., after login)
  }, [user, fetchWishlist]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Wishlist
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Your wishlist is empty. Browse products and add them to your wishlist!
        </Typography>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 3, 
          alignItems: 'start' 
        }}>
          {items.map((product) => (
            <Box key={product.id} sx={{ height: '100%' }}>
              <ProductCard product={product} initialInWishlist={true} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Wishlist;
