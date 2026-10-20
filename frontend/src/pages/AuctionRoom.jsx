import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress, Container, Paper, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import auctionApi from '../services/auctionApi';
import productApi from '../services/productApi';
import webSocketService from '../services/websocket';

import Countdown from '../components/auction/Countdown';
import AuctionStatusBadge from '../components/auction/AuctionStatusBadge';
import BidHistory from '../components/auction/BidHistory';
import BidInput from '../components/auction/BidInput';
import WinnerBanner from '../components/auction/WinnerBanner';
import LiveStatistics from '../components/auction/LiveStatistics';
import UserBidStatus from '../components/auction/UserBidStatus';
import toast from 'react-hot-toast';

const AuctionRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const hasLoadedInitial = useRef(false);

  const fetchAuctionState = async (isReconnect = false) => {
    try {
      const auctionData = await auctionApi.getAuctionDetails(id);
      
      if (!isReconnect && auctionData.productId) {
        try {
          const productData = await productApi.getProduct(auctionData.productId);
          auctionData.product = productData;
        } catch (e) {
          console.warn("Failed to load product for auction", e);
        }
      }
      
      setAuction(prev => isReconnect ? { ...prev, ...auctionData } : auctionData);
      
      const bidData = await auctionApi.getBidHistory(id);
      setBids(bidData || []);
    } catch (err) {
      console.error('Failed to fetch auction state', err);
      if (!isReconnect) {
        toast.error('Auction not found');
        navigate('/auctions');
      }
    } finally {
      if (!isReconnect) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionState();
    hasLoadedInitial.current = true;
  }, [id, navigate]);

  useEffect(() => {
    if (!auction) return;
    
    // Subscribe to WS connection status
    const unsubscribeConn = webSocketService.addConnectionListener((status) => {
      setIsConnected(status);
      // If we just reconnected, sync state to ensure no missed events
      if (status && hasLoadedInitial.current) {
        fetchAuctionState(true);
      }
    });

    // Subscribe to auction-level events (status changes, end, bid extension)
    const unsubscribeAuction = webSocketService.subscribe(`/topic/auction/${id}/events`, (eventMsg) => {
      // Sync full state on any event
      fetchAuctionState(true);

      // If auction ended, update status immediately
      if (eventMsg?.type === 'AUCTION_ENDED' || eventMsg?.auctionStatus === 'ENDED') {
        setAuction(prev => prev ? { ...prev, status: 'ENDED' } : prev);
      }

      // Handle end-time extension (late bid)
      if (eventMsg?.payload?.endTime) {
        setAuction(prev => {
          if (prev && new Date(eventMsg.payload.endTime) > new Date(prev.endTime)) {
            toast('Auction extended due to late bid!', { icon: '⏳' });
            return { ...prev, endTime: eventMsg.payload.endTime };
          }
          return prev;
        });
      }
    });

    const unsubscribeBids = webSocketService.subscribe(`/topic/auction/${id}/bids`, (newBid) => {
      // Forceful sync
      fetchAuctionState(true);

      setBids((prevBids) => {
        // Fix undefined === undefined bug
        if (newBid.id && prevBids.some(b => b.id === newBid.id)) return prevBids;
        if (prevBids.some(b => b.amount === newBid.amount && b.bidTime === newBid.bidTime)) return prevBids;
        
        // Outbid notification logic
        if (prevBids.length > 0) {
          const currentHighestBidder = prevBids[0].bidderId || (prevBids[0].bidder && prevBids[0].bidder.id);
          const newBidderId = newBid.bidderId || (newBid.bidder && newBid.bidder.id);
          const currentUserId = user?.userId;
          
          if (currentUserId && 
              String(currentHighestBidder) === String(currentUserId) && 
              String(newBidderId) !== String(currentUserId)) {
            toast.error(`You have been outbid! ${newBid.bidderName || newBid.name || 'Someone'} placed ₹${Number(newBid.amount || newBid.bidAmount).toLocaleString('en-IN')}`, {
              duration: 5000,
              icon: '⚠'
            });
          }
        }
        
        return [newBid, ...prevBids];
      });
      
      setAuction((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentPrice: Math.max(Number(prev.currentPrice || 0), Number(newBid.amount || 0))
        };
      });
    });

    const unsubscribeErrors = webSocketService.subscribe(`/user/queue/errors`, (errorMsg) => {
      toast.error(errorMsg.message || 'Failed to place bid');
    });

    const unsubscribeNotifications = webSocketService.subscribe(`/user/queue/notifications`, (msg) => {
      // Ignore text notifications if they are too noisy, or display them
      // toast(msg); 
    });

    return () => {
      unsubscribeConn();
      unsubscribeAuction();
      unsubscribeBids();
      unsubscribeErrors();
      unsubscribeNotifications();
    };
  }, [auction?.id, id]); 

  const handlePlaceBid = (amount) => {
    webSocketService.sendBid(id, amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!auction) return null;

  // Derive seller check using new sellerId field from backend
  const isSeller = user && auction.sellerId && String(user.userId) === String(auction.sellerId);
  const isEnded = auction.status === 'ENDED' || auction.status === 'CANCELLED';
  // Use winnerId from backend (now populated correctly)
  const isWinner = user && auction.winnerId && String(user.userId) === String(auction.winnerId);
  const hasTimeExpired = auction.endTime && new Date(auction.endTime) <= new Date();
  const hasBids = bids.length > 0;

  // Determine WinnerBanner role
  const winnerBannerRole = !isEnded ? 'none'
    : !hasBids ? 'none'
    : isWinner ? 'winner'
    : isSeller ? 'seller'
    : 'participant';
  
  let disabledReason = '';
  if (!isConnected) disabledReason = 'Reconnecting to live server...';
  else if (!user) disabledReason = 'You must be logged in to bid.';
  else if (isSeller) disabledReason = 'You cannot bid on your own auction.';
  else if (isEnded || hasTimeExpired) disabledReason = 'This auction has ended.';
  else if (auction.status !== 'ACTIVE') disabledReason = 'This auction is not active yet.';

  const img = auction.productThumbnail || auction.product?.images?.[0]?.imageUrl || '/default-product.png';
  const fullImgUrl = img.startsWith('http') || img.startsWith('data:') 
    ? img 
    : `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}${img.startsWith('/') ? '' : '/'}${img}`;

  return (
    <Container maxWidth="xl" sx={{ py: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      {/* WS Connection Status */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: -0.5 }}>
          Auction Room
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1, bgcolor: isConnected ? 'success.light' : 'warning.light', color: isConnected ? 'success.dark' : 'warning.dark', borderRadius: 8, fontWeight: 'bold' }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'currentColor', animation: isConnected ? 'pulse 2s infinite' : 'none' }} />
          {isConnected ? 'Live Connection' : 'Reconnecting...'}
        </Box>
      </Box>

      {/* Winner Banner */}
      {isEnded && (
        <WinnerBanner
          role={winnerBannerRole}
          winnerName={auction.winnerName || ''}
          winningBid={auction.currentPrice}
          // Legacy props still supported inside WinnerBanner
          isCurrentUser={isWinner}
          isSeller={isSeller}
        />
      )}
      {isEnded && !hasBids && (
        <WinnerBanner role="none" />
      )}

      <Grid container spacing={4} sx={{ position: 'relative' }}>
        {/* Left Col: Product Info (60%) */}
        <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <AuctionStatusBadge status={auction.status} />
              <Typography variant="subtitle2" color="text.secondary" fontWeight="700">
                AUCTION #{auction.id}
              </Typography>
            </Box>
            
            <Typography variant="h3" fontWeight="900" sx={{ lineHeight: 1.2, letterSpacing: -0.5 }}>
              {auction.productTitle || auction.product?.title || 'Unknown Product'}
            </Typography>

            {/* Product Meta */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: 'text.secondary' }}>
              <Typography variant="body2" fontWeight="700">Brand: <span style={{ color: 'black' }}>{auction.product?.brand || 'N/A'}</span></Typography>
              <Typography variant="body2" fontWeight="700">Condition: <span style={{ color: 'black' }}>{auction.product?.condition || 'N/A'}</span></Typography>
              <Typography variant="body2" fontWeight="700">Seller: <span style={{ color: '#2563EB' }}>{auction.sellerName || 'Anonymous'}</span></Typography>
            </Box>
            
            <Box sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 4, display: 'flex', justifyContent: 'center', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <Box component="img" 
                src={fullImgUrl} 
                alt={auction.productTitle || auction.product?.title}
                sx={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'contain' }}
              />
            </Box>
            
            <Box sx={{ p: 3, bgcolor: '#ffffff', borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight="800" sx={{ mb: 2 }}>Description</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {auction.product?.description || 'No description provided.'}
              </Typography>
            </Box>

          </Box>
        </Grid>

        {/* Right Col: Sticky Bidding Panel (40%) */}
        <Grid item xs={12} md={5} order={{ xs: 1, md: 2 }}>
          <Box sx={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Live Bidding Panel */}
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'primary.light', boxShadow: '0 12px 40px rgba(37,99,235,0.08)', position: 'relative', overflow: 'hidden' }}>
              {/* Optional background glow */}
              <Box sx={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)' }} />
              
              {!isEnded && <UserBidStatus currentUserId={user?.userId} bids={bids} status={auction.status} />}
              
              <Typography variant="subtitle2" color="text.secondary" fontWeight="800" textTransform="uppercase" letterSpacing={1}>
                Current Highest Bid
              </Typography>
              <Typography variant="h2" color="primary.main" fontWeight="900" sx={{ mb: 1, letterSpacing: -1 }}>
                ₹{Number(auction.currentPrice).toLocaleString('en-IN')}
              </Typography>

              {!isEnded && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight="600">Auction ends in:</Typography>
                  <Countdown endTime={auction.endTime} status={auction.status} />
                </Box>
              )}

              <Divider sx={{ mb: 3 }} />

              {!isEnded ? (
                <BidInput 
                  disabled={!!disabledReason}
                  disabledReason={disabledReason}
                  currentPrice={auction.currentPrice}
                  minIncrement={auction.minimumBidIncrement || 1}
                  onPlaceBid={handlePlaceBid}
                  isWinning={isWinner && !isEnded}
                />
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" color="text.secondary" fontWeight="700">Auction has ended</Typography>
                </Box>
              )}
            </Paper>

          </Box>
        </Grid>
      </Grid>
      
      {/* Full Width Bid History & Stats Below Main Section */}
      <Box sx={{ mt: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <LiveStatistics auction={auction} bids={bids} />
        <BidHistory bids={bids} isEnded={isEnded} currentUserId={user?.userId} />
      </Box>
    </Container>
  );
};

export default AuctionRoom;
