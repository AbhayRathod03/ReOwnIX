import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid, Paper, Divider, Button } from '@mui/material';
import productApi from '../services/productApi';
import chatService from '../services/chatService';
import reviewApi from '../services/reviewApi';
import wishlistApi from '../services/wishlistApi';
import ReviewForm from '../components/review/ReviewForm';
import ReviewCard from '../components/review/ReviewCard';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { subscriptionService } from '../services/dotnet/subscriptionService';
import { Lock as LockIcon } from 'lucide-react';

// New Sub-Components
import ProductGallery from '../components/product/ProductGallery';
import ProductActionsCard from '../components/product/ProductActionsCard';
import SellerInfoCard from '../components/product/SellerInfoCard';
import ProductSpecsTable from '../components/product/ProductSpecsTable';
import RelatedProducts from '../components/product/RelatedProducts';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Premium Guard state
  const [canView, setCanView] = useState(true);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAcceptedOffer, setHasAcceptedOffer] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Action loading states
  const [chatLoading, setChatLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!canView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [canView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await productApi.getProduct(id);
        
        if (prod.images && prod.images.length > 0) {
          setImages(prod.images);
        } else {
          setImages([]);
        }

        // Fetch dynamic seller rating if owner exists
        if (prod.owner && prod.owner.id) {
          try {
            const ratingData = await reviewApi.getSellerRating(prod.owner.id);
            prod.owner.rating = ratingData.averageRating;
            prod.owner.reviewsCount = ratingData.totalReviews;
          } catch (err) {
            console.warn('Failed to fetch dynamic seller rating', err);
          }
        }

        setProduct(prod);
        
        // Fetch wishlist status and offer status
        if (user) {
          try {
            // Check premium subscription / free trial limit
            const viewCheck = await subscriptionService.checkCanViewProduct(user.userId);
            const isAllowed = viewCheck?.data?.canView ?? viewCheck?.canView ?? viewCheck;
            setCanView(isAllowed);
            
            // Record view if allowed
            if (isAllowed) {
              await subscriptionService.recordProductView(user.userId).catch(console.error);
            }
          } catch (premiumErr) {
            console.error('Premium check failed', premiumErr);
            // Default to true if the .NET backend is unreachable to avoid breaking existing marketplace
            setCanView(true);
          }

          try {
            const myWishlist = await wishlistApi.get();
            setIsWishlisted(myWishlist.some(w => String(w.id) === String(id)));
          } catch (wishErr) {
            console.error('Failed to fetch wishlist', wishErr);
          }

          try {
            const { default: offerApi } = await import('../services/offerApi');
            const myOffers = await offerApi.getMyOffers();
            const acceptedOffer = myOffers.find(o => String(o.product.id) === String(id) && o.status === 'ACCEPTED');
            setHasAcceptedOffer(!!acceptedOffer);
          } catch (offerErr) {
            console.error('Failed to fetch offers', offerErr);
          }
        }
        
        await fetchReviews(prod);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchReviews = useCallback(async (currentProduct) => {
    // Backend doesn't support fetching reviews by product ID, so we fetch by seller ID
    // and filter for this specific product.
    if (!currentProduct?.owner?.id) return;
    
    setReviewsLoading(true);
    try {
      const data = await reviewApi.getBySeller(currentProduct.owner.id);
      // Optional: Filter if we only want to show reviews for THIS product
      // const productReviews = (data || []).filter(r => String(r.productTitle) === String(currentProduct.title));
      // But typically, a product page shows the seller's reviews. Let's just show all.
      setReviews(data || []); 
    } catch (err) {
      console.warn('Failed to fetch reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  const handleStartChat = async () => {
    try {
      setChatLoading(true);
      const { conversationId } = await chatService.startConversation(product.id);
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      console.error('Start chat error', err);
      toast.error('Could not start chat');
    } finally {
      setChatLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewApi.remove(reviewId);
      setReviews((prev) => prev.filter((r) => r.reviewId !== reviewId));
      toast.success('Review deleted');
    } catch (err) {
      console.error('Delete review failed', err);
      toast.error('Could not delete review');
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to use wishlist');
      return;
    }
    try {
      setWishlistLoading(true);
      if (isWishlisted) {
        await wishlistApi.remove(id);
        setIsWishlisted(false);
        setProduct(prev => ({ ...prev, wishlistCount: Math.max(0, (prev.wishlistCount || 1) - 1) }));
        toast.success('Removed from wishlist');
      } else {
        await wishlistApi.add(id);
        setIsWishlisted(true);
        setProduct(prev => ({ ...prev, wishlistCount: (prev.wishlistCount || 0) + 1 }));
        toast.success('Added to wishlist');
      }
    } catch (err) {
      console.error('Wishlist toggle error', err);
      toast.error(err.response?.data?.message || 'Could not update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h5" color="text.secondary">Product not found.</Typography>
      </Box>
    );
  }

  const isOwner = user && product.owner && String(user.userId) === String(product.owner.id);

  return (
    <Box sx={{ position: 'relative', minHeight: '80vh' }}>
      
      {!canView && (
        <Box 
          sx={{ 
            position: 'fixed', 
            inset: 0,
            width: '100vw',
            height: '100vh', 
            zIndex: 9999, 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            bgcolor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Paper elevation={3} sx={{ p: 5, borderRadius: 4, textAlign: 'center', maxWidth: 400 }}>
            <LockIcon size={48} color="#2563EB" style={{ marginBottom: 16 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Premium Required
            </Typography>
            <Typography color="text.secondary" paragraph>
              You've used all free product views. Upgrade to ReOwnIX Premium to continue browsing the marketplace.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/premium')}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              View Plans
            </Button>
          </Paper>
        </Box>
      )}

      <Box sx={{ 
        maxWidth: 'xl', mx: 'auto', py: 4, px: { xs: 2, md: 4, lg: 6 },
        filter: canView ? 'none' : 'blur(4px)',
        pointerEvents: canView ? 'auto' : 'none',
        userSelect: canView ? 'auto' : 'none'
      }}>
      
      {/* ABOVE THE FOLD (Gallery + Actions) */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* Left Column: Image Gallery */}
        <Grid item xs={12} md={7} lg={8}>
          <ProductGallery images={images} fallbackImage={product.thumbnail} />
        </Grid>

        {/* Right Column: Actions & Price */}
        <Grid item xs={12} md={5} lg={4}>
          <ProductActionsCard 
            product={product} 
            isOwner={isOwner} 
            onStartChat={handleStartChat}
            isChatLoading={chatLoading}
            isWishlisted={isWishlisted}
            onToggleWishlist={handleToggleWishlist}
            isWishlistLoading={wishlistLoading}
          />
        </Grid>
      </Grid>

      {/* BELOW THE FOLD */}
      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          
          {/* Description Section */}
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {product.description || 'No description provided.'}
            </Typography>
          </Paper>

          {/* Product Specs Table */}
          <ProductSpecsTable product={product} />

          {/* Reviews Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Product Reviews
            </Typography>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ mb: 3 }}>
                <ReviewForm productId={product.id} sellerId={product.owner?.id} onSuccess={() => fetchReviews(product)} />
              </Box>
              
              <Divider sx={{ mb: 3 }} />

              {reviewsLoading ? (
                <CircularProgress size={24} />
              ) : reviews.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reviews.map((rev) => (
                    <ReviewCard
                      key={rev.reviewId}
                      review={rev}
                      canDelete={user && rev.buyerName === `${user.firstName} ${user.lastName}`}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No reviews yet. Be the first to share your thoughts!
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Sidebar Area to eliminate empty space */}
          <SellerInfoCard owner={product.owner} onStartChat={handleStartChat} hasAcceptedOffer={hasAcceptedOffer} />
          
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
             <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>Buyer Protection</Typography>
             <Typography variant="body2" sx={{ opacity: 0.9 }}>
               Every purchase is secured. If the item doesn't match the description, you are eligible for a full refund within 7 days.
             </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Related Products */}
      <Divider sx={{ my: 4 }} />
      <RelatedProducts currentProductId={product.id} category={product.category} />

      </Box>
    </Box>
  );
};

export default ProductDetails;
