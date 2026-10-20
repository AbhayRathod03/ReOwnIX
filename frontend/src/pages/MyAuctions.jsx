import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab, Typography, Skeleton } from '@mui/material';
import { Gavel } from 'lucide-react';
import auctionApi from '../services/auctionApi';
import productApi from '../services/productApi';
import { useAuth } from '../context/AuthContext';
import AuctionCard from '../components/auction/AuctionCard';

/**
 * Enriches auctions that are missing image data by fetching the full product.
 */
const enrichAuctions = async (auctions) => {
  return Promise.all(
    auctions.map(async (auc) => {
      const hasImage =
        auc.productThumbnail ||
        auc.product?.thumbnail ||
        (auc.product?.images && auc.product.images.length > 0);

      if (!hasImage && auc.productId) {
        try {
          const prod = await productApi.getProduct(auc.productId);
          return { ...auc, product: prod, productTitle: auc.productTitle || prod.title };
        } catch {
          return auc;
        }
      }
      return auc;
    })
  );
};

const SkeletonCard = () => (
  <Box sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
    <Skeleton variant="rectangular" height={200} animation="wave" />
    <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Skeleton variant="text" width="80%" height={24} animation="wave" />
      <Skeleton variant="text" width="50%" height={20} animation="wave" />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Skeleton variant="text" width="40%" height={32} animation="wave" />
        <Skeleton variant="text" width="35%" height={32} animation="wave" />
      </Box>
      <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2, mt: 1 }} animation="wave" />
    </Box>
  </Box>
);

const MyAuctions = () => {
  const { user } = useAuth();
  const [subTab, setSubTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myBidAuctions, setMyBidAuctions] = useState([]);
  const [myCreatedAuctions, setMyCreatedAuctions] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        // 1. Fetch auctions the user has bid on
        const bids = await auctionApi.getMyBids().catch(() => []);
        const uniqueAuctionIds = [...new Set(bids.map(b => b.auctionId))];

        const bidAuctionsPromises = uniqueAuctionIds.map(id =>
          auctionApi.getAuctionDetails(id).catch(() => null)
        );
        const bidAuctionsResults = await Promise.all(bidAuctionsPromises);
        const validBidAuctions = bidAuctionsResults.filter(Boolean);
        const enrichedBidAuctions = await enrichAuctions(validBidAuctions);
        setMyBidAuctions(enrichedBidAuctions);

        // 2. Fetch auctions the user created
        const myProducts = await productApi.getMyProducts().catch(() => []);
        const createdAuctionsPromises = myProducts.map(p =>
          auctionApi.getAuctionByProductId(p.id).catch(() => null)
        );
        const createdAuctionsResults = await Promise.all(createdAuctionsPromises);
        const validCreatedAuctions = createdAuctionsResults.filter(Boolean);
        const enrichedCreatedAuctions = await enrichAuctions(validCreatedAuctions);
        setMyCreatedAuctions(enrichedCreatedAuctions);
      } catch (err) {
        console.error('Failed to load user auctions', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAuctions();
    }
  }, [user]);

  // Categorize bid auctions
  const liveAuctions = myBidAuctions.filter(a => a.status === 'ACTIVE');
  const upcomingAuctions = myBidAuctions.filter(a => a.status === 'UPCOMING');

  const wonAuctions = myBidAuctions.filter(a => {
    const isEnded = a.status === 'ENDED';
    const isWinner = String(a.winnerId || (a.winner && a.winner.id)) === String(user?.userId);
    return isEnded && isWinner;
  });

  const lostAuctions = myBidAuctions.filter(a => {
    const isEnded = a.status === 'ENDED';
    const isWinner = String(a.winnerId || (a.winner && a.winner.id)) === String(user?.userId);
    return isEnded && !isWinner;
  });

  const endedAuctions = myBidAuctions.filter(a => a.status === 'ENDED' || a.status === 'CANCELLED');

  const getFilteredAuctions = () => {
    switch (subTab) {
      case 0: return liveAuctions;
      case 1: return upcomingAuctions;
      case 2: return wonAuctions;
      case 3: return lostAuctions;
      case 4: return endedAuctions;
      case 5: return myCreatedAuctions;
      default: return [];
    }
  };

  const currentAuctions = getFilteredAuctions();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>My Auctions</Typography>
      </Box>
      <Tabs
        value={subTab}
        onChange={(e, v) => setSubTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
        }}
      >
        <Tab label={`Live (${liveAuctions.length})`} />
        <Tab label={`Upcoming (${upcomingAuctions.length})`} />
        <Tab label={`Won (${wonAuctions.length})`} />
        <Tab label={`Lost (${lostAuctions.length})`} />
        <Tab label={`All Ended (${endedAuctions.length})`} />
        <Tab label={`Created by Me (${myCreatedAuctions.length})`} />
      </Tabs>

      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      ) : currentAuctions.length === 0 ? (
        <Box
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <Gavel size={30} color="#94a3b8" />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
            No auctions found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            No auctions found in this category.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {currentAuctions.map(auction => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MyAuctions;
