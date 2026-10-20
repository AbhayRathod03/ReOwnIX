import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Card, CardContent } from '@mui/material';
import { ChevronLeft, ChevronRight, Clock, Gavel, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import auctionApi from '../../services/auctionApi';
import { useColorMode } from '../../context/ThemeContext';
import SkeletonBox from '../common/SkeletonBox';

import productApi from '../../services/productApi';

const FeaturedAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const { mode } = useColorMode();

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await auctionApi.getActiveAuctions();
        const topAuctions = data.slice(0, 10);
        
        // Fetch full product details for any auction missing an image
        const populatedAuctions = await Promise.all(topAuctions.map(async (auc) => {
          if (!auc.productThumbnail && !auc.product?.images && auc.productId) {
            try {
              const prod = await productApi.getProduct(auc.productId);
              return { ...auc, product: prod };
            } catch (e) {
              return auc;
            }
          }
          return auc;
        }));
        
        setAuctions(populatedAuctions);
      } catch (err) {
        console.error('Failed to load featured auctions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const calculateTimeLeft = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    if (total <= 0) return 'Ended';
    const h = Math.floor((total / (1000 * 60 * 60)) % 24);
    const m = Math.floor((total / 1000 / 60) % 60);
    return `${h}h ${m}m`;
  };

  if (loading) {
    return (
      <Box sx={{ py: 6, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>Live Auctions</Typography>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'hidden' }}>
          {[1, 2, 3, 4].map(i => <SkeletonBox key={i} height={350} width={300} sx={{ flexShrink: 0, borderRadius: 4 }} />)}
        </Box>
      </Box>
    );
  }

  if (auctions.length === 0) return null;

  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', px: { xs: 2, md: 4 }, mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 2, letterSpacing: '-0.5px' }}>
            <Box component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Live Auctions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Bid on premium items before time runs out.</Typography>
        </Box>
        <Button 
          component={Link} 
          to="/auctions" 
          endIcon={<ArrowRight size={18} />}
          sx={{ display: { xs: 'none', sm: 'flex' }, color: 'text.primary', fontWeight: 600, '&:hover': { bgcolor: 'background.default' } }}
        >
          View All
        </Button>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <IconButton 
          onClick={() => scrollBy(-350)} 
          sx={{ 
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: { xs: 'none', md: 'flex' }, '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            px: { xs: 2, md: 4 },
            pb: 4
          }}
        >
          {auctions.map((auction) => (
            <Card 
              key={auction.id}
              sx={{
                minWidth: 320,
                maxWidth: 320,
                flexShrink: 0,
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Box component={Link} to={`/auctions/${auction.id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ position: 'relative', height: 220 }}>
                  <Box 
                    component="img" 
                    src={(() => {
                      const img = auction.productThumbnail || auction.product?.thumbnail || (auction.product?.images && auction.product.images[0]?.imageUrl) || (auction.product?.images && typeof auction.product.images[0] === 'string' ? auction.product.images[0] : null);
                      if (!img || img === 'PR') return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
                      if (img.startsWith('http') || img.startsWith('data:')) return img;
                      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
                      return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
                    })()}
                    onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999999'%3EImage Not Found%3C/text%3E%3C/svg%3E"; 
                    }}
                    alt={auction.productTitle || auction.product?.title || 'Auction Product'}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', '&:hover': { transform: 'scale(1.05)' } }}
                  />
                  <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', fontWeight: 700, boxShadow: '0 2px 8px rgba(255, 56, 92, 0.4)' }}>
                    <Clock size={14} /> {calculateTimeLeft(auction.endTime)}
                  </Box>
                  <Box sx={{ position: 'absolute', bottom: 12, right: 12, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1.5, py: 0.5, borderRadius: 8, backdropFilter: 'blur(4px)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {auction.totalBids || 0} Bids
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" noWrap sx={{ mb: 1 }}>{auction.productTitle}</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="600">Current Bid</Typography>
                      <Typography variant="h5" color="primary.main" fontWeight="900">₹{auction.currentPrice?.toLocaleString('en-IN') || 0}</Typography>
                    </Box>
                  </Box>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<Gavel size={18} />}
                    sx={{ borderRadius: 2, py: 1.5, fontWeight: 700, fontSize: '1rem', background: 'linear-gradient(to right, #2563EB, #1D4ED8)' }}
                  >
                    Place Bid
                  </Button>
                </CardContent>
              </Box>
            </Card>
          ))}
        </Box>

        <IconButton 
          onClick={() => scrollBy(350)} 
          sx={{ 
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: { xs: 'none', md: 'flex' }, '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 56, 92, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 56, 92, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 56, 92, 0); }
          }
        `}
      </style>
    </Box>
  );
};

export default FeaturedAuctions;
