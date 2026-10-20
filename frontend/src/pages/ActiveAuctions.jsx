// src/pages/ActiveAuctions.jsx
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import auctionApi from '../services/auctionApi';
import AuctionGrid from '../components/AuctionGrid';
import EmptyState from '../components/EmptyState';

/**
 * Page that displays all active auctions.
 * - Fetches data from GET /api/auctions (active only).
 * - Shows loading indicator while fetching.
 * - Shows an empty state when no auctions are returned.
 * - Shows an error alert if the request fails.
 * - Uses the responsive AuctionGrid component for layout.
 */
const ActiveAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    auctionApi
      .getActiveAuctions()
      .then((data) => {
        if (mounted) setAuctions(data || []);
      })
      .catch((err) => {
        console.error('Failed to fetch active auctions', err);
        if (mounted) setError(err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth={800} mx="auto" p={3}>
        <Alert severity="error">Failed to load auctions. Please try again later.</Alert>
      </Box>
    );
  }

  if (!loading && auctions.length === 0) {
    return <EmptyState message="No active auctions at the moment." />;
  }

  return (
    <Box sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        Active Auctions
      </Typography>
      <AuctionGrid auctions={auctions} />
    </Box>
  );
};

export default ActiveAuctions;
