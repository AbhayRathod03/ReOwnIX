import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Skeleton, Button, Tabs, Tab } from '@mui/material';
import { Gavel, Plus, Search, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import auctionApi from '../services/auctionApi';
import productApi from '../services/productApi';
import AuctionCard from '../components/auction/AuctionCard';

/**
 * Enriches auctions that are missing image data by fetching the full product.
 * This compensates for auction list endpoints that don't embed product images.
 */
const enrichAuctionsWithImages = async (auctions) => {
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

// Skeleton loader cards for layout stability
const SkeletonCard = () => (
  <Box
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }}
  >
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

const AuctionList = () => {
  const [allAuctions, setAllAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 0=All, 1=Live, 2=Upcoming, 3=Ended

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const data = await auctionApi.getActiveAuctions();
      const enriched = await enrichAuctionsWithImages(data || []);
      setAllAuctions(enriched);
    } catch (err) {
      console.error('Failed to fetch auctions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const liveAuctions = allAuctions.filter((a) => a.status === 'ACTIVE');
  const upcomingAuctions = allAuctions.filter((a) => a.status === 'UPCOMING' || a.status === 'PENDING');
  const endedAuctions = allAuctions.filter((a) => a.status === 'ENDED' || a.status === 'CANCELLED');

  const getFilteredAuctions = () => {
    switch (activeTab) {
      case 1:
        return liveAuctions;
      case 2:
        return upcomingAuctions;
      case 3:
        return endedAuctions;
      default:
        return allAuctions;
    }
  };

  const filteredAuctions = getFilteredAuctions();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              letterSpacing: '-0.5px',
              mb: 0.5,
            }}
          >
            <Gavel size={28} />
            Auctions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bid on premium pre-owned items before time runs out.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={fetchAuctions}
            variant="outlined"
            startIcon={<RefreshCw size={16} />}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            component={Link}
            to="/create-product"
            variant="contained"
            startIcon={<Plus size={16} />}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            Create Auction
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            minHeight: 44,
          },
        }}
      >
        <Tab label={`All (${allAuctions.length})`} />
        <Tab
          label={`Live (${liveAuctions.length})`}
          icon={
            liveAuctions.length > 0 ? (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: '#22c55e',
                  animation: 'pulse-dot 2s infinite',
                  '@keyframes pulse-dot': {
                    '0%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.5)' },
                    '70%': { boxShadow: '0 0 0 6px rgba(34,197,94,0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0)' },
                  },
                }}
              />
            ) : undefined
          }
          iconPosition="start"
        />
        <Tab label={`Upcoming (${upcomingAuctions.length})`} />
        <Tab label={`Ended (${endedAuctions.length})`} />
      </Tabs>

      {/* Loading Skeleton Grid */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </Box>
      )}

      {/* Auction Grid */}
      {!loading && filteredAuctions.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!loading && filteredAuctions.length === 0 && (
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              bgcolor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <Gavel size={36} color="#94a3b8" />
          </Box>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
            No auctions found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 420 }}>
            {activeTab === 1
              ? 'There are no live auctions right now. Check back soon or create your own!'
              : activeTab === 2
              ? 'No upcoming auctions scheduled yet.'
              : activeTab === 3
              ? 'No ended auctions to show.'
              : 'No auctions available right now. Be the first to create one!'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              component={Link}
              to="/products"
              variant="outlined"
              startIcon={<Search size={16} />}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}
            >
              Browse Products
            </Button>
            <Button
              component={Link}
              to="/create-product"
              variant="contained"
              startIcon={<Plus size={16} />}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              }}
            >
              Create Auction
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default AuctionList;
