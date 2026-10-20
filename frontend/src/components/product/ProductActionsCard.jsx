import React, { useState } from 'react';
import { Box, Paper, Typography, Chip, Button, Grid, IconButton, Divider } from '@mui/material';
import { Heart, Edit2, Image as ImageIcon, Trash2, Gavel, MapPin, Eye, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog';
import toast from 'react-hot-toast';
import productApi from '../../services/productApi';
import auctionApi from '../../services/auctionApi';
import wishlistApi from '../../services/wishlistApi';
import MakeOfferDialog from '../offer/MakeOfferDialog';
import { useAuth } from '../../context/AuthContext';

const ProductActionsCard = ({ product, isOwner, onStartChat, isChatLoading, isWishlisted, onToggleWishlist, isWishlistLoading }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [auctionLoading, setAuctionLoading] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  const requireAuth = (callback) => {
    if (!user) {
      toast.error('Please login to continue.');
      navigate('/login', { state: { from: location } });
      return;
    }
    callback();
  };

  if (!product) return null;

  const { id, title, price, condition, category, brand, listingType } = product;

  const handleDeleteProduct = async () => {
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/profile/my-products');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error('You do not have permission to delete this product.');
      } else {
        toast.error('Could not delete product');
      }
    } finally {
      setDeleteOpen(false);
    }
  };

  const handleJoinAuction = async () => {
    try {
      setAuctionLoading(true);
      const auction = await auctionApi.getAuctionByProductId(id);
      if (auction && auction.id) {
        navigate(`/auctions/${auction.id}`);
      } else {
        toast.error('Auction not found');
      }
    } catch (err) {
      console.error('Failed to find auction for product', err);
      if (err.response?.status === 404) {
        toast.error('Auction not found for this product');
      } else {
        toast.error('Failed to load live auction room');
      }
    } finally {
      setAuctionLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', position: 'sticky', top: 24 }}>
        
        {/* Badges */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip label={condition || 'USED'} size="small" sx={{ bgcolor: 'grey.100', fontWeight: 600, color: 'text.secondary' }} />
          <Chip label={category || 'GENERAL'} size="small" sx={{ bgcolor: 'grey.100', fontWeight: 600, color: 'text.secondary' }} />
          {listingType === 'AUCTION' && (
            <Chip icon={<Gavel size={14} />} label="AUCTION" size="small" color="secondary" sx={{ fontWeight: 700 }} />
          )}
        </Box>

        {/* Title & Price */}
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>{title}</Typography>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 900, mb: 3 }}>
          ₹{Number(price).toLocaleString('en-IN')}
        </Typography>

        {/* Meta Stats */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, color: 'text.secondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Calendar size={16} /> 
            <Typography variant="body2">
              Posted {new Date(product.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Eye size={16} /> 
            <Typography variant="body2">{product.views || 0} views</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {listingType === 'AUCTION' ? (
            // AUCTION PRODUCT
            <Button 
              variant="contained" 
              color="secondary"
              size="large" 
              disabled={auctionLoading}
              onClick={() => requireAuth(handleJoinAuction)}
              sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 2 }}
            >
              {auctionLoading ? 'Joining...' : 'Join Live Auction'}
            </Button>
          ) : isOwner ? (
            // OWNER PERMISSIONS
            <>
              <Button 
                variant="contained" 
                color="primary"
                size="large" 
                startIcon={<Edit2 size={20} />}
                onClick={() => navigate(`/products/edit/${id}`)}
                sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
              >
                Edit Product
              </Button>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    startIcon={<ImageIcon size={20} />}
                    onClick={() => navigate(`/upload-images/${id}`)}
                    sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
                  >
                    Images
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    color="error"
                    fullWidth 
                    size="large"
                    startIcon={<Trash2 size={20} />}
                    onClick={() => setDeleteOpen(true)}
                    sx={{ py: 1.5, fontWeight: 600, borderRadius: 2 }}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            // BUYER PERMISSIONS
            <>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<MessageCircle size={20} />}
                onClick={() => requireAuth(() => setOfferOpen(true))}
                sx={{ py: 2, fontSize: '1.1rem', fontWeight: 700, borderRadius: 2 }}
              >
                Make Offer
              </Button>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    size="large"
                    onClick={() => requireAuth(onStartChat)}
                    disabled={isChatLoading}
                    sx={{ py: 1.5, fontWeight: 600, borderRadius: 2, color: 'text.primary', borderColor: 'grey.300' }}
                  >
                    {isChatLoading ? 'Loading...' : 'Message Seller'}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    variant="outlined"
                    color="inherit"
                    fullWidth 
                    size="large"
                    onClick={() => requireAuth(onToggleWishlist)}
                    disabled={isWishlistLoading}
                    startIcon={<Heart size={20} fill={isWishlisted ? "#ef4444" : "none"} color={isWishlisted ? "#ef4444" : "currentColor"} />}
                    sx={{ 
                      py: 1.5, 
                      fontWeight: 600, 
                      borderRadius: 2, 
                      borderColor: isWishlisted ? '#ef4444' : 'grey.300',
                      color: isWishlisted ? '#ef4444' : 'text.primary',
                      '&:hover': {
                        borderColor: isWishlisted ? '#dc2626' : 'grey.400',
                        bgcolor: isWishlisted ? 'rgba(239, 68, 68, 0.04)' : 'rgba(0,0,0,0.02)'
                      }
                    }}
                  >
                    {isWishlistLoading ? '...' : `Wishlist (${product.wishlistCount || 0})`}
                  </Button>
                </Grid>
              </Grid>
              <Button 
                variant="text" 
                color="inherit" 
                startIcon={<AlertTriangle size={16} />} 
                sx={{ mt: 1, textTransform: 'none', color: 'text.secondary' }}
              >
                Report Listing
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete Product?"
        description={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteOpen(false)}
      />
      <MakeOfferDialog
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductActionsCard;
