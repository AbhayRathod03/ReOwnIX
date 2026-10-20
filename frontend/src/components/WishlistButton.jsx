// src/components/WishlistButton.jsx
import React, { useState } from 'react';
import { IconButton, CircularProgress } from '@mui/material';
import { Heart, HeartOff } from 'lucide-react';
import toast from 'react-hot-toast';
import wishlistApi from '../services/wishlistApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * WishlistButton toggles a product's wishlist state.
 * Props:
 *   - productId: ID of the product
 *   - initialInWishlist: optional boolean, default false
 */
const WishlistButton = ({ productId, initialInWishlist = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to continue.');
      navigate('/login', { state: { from: location } });
      return;
    }
    setLoading(true);
    try {
      if (inWishlist) {
        await wishlistApi.remove(productId);
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(productId);
        toast.success('Added to wishlist');
      }
      setInWishlist(!inWishlist);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton onClick={handleToggle} disabled={loading} aria-label="wishlist">
      {loading ? (
        <CircularProgress size={20} />
      ) : inWishlist ? (
        <Heart fill="#ef4444" color="#ef4444" size={20} />
      ) : (
        <Heart color="gray" size={20} />
      )}
    </IconButton>
  );
};

export default WishlistButton;
