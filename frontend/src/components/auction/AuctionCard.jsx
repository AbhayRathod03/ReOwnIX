import React, { useState, useEffect } from 'react';
import { Card, CardMedia, Box, Typography, Button, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Trophy, Users, Image as ImageIcon, Clock, Gavel, Eye } from 'lucide-react';
import AuctionStatusBadge from './AuctionStatusBadge';
import Countdown from './Countdown';

/**
 * Resolves the best available image URL from an auction object.
 * Checks top-level flat fields first, then nested product object.
 */
const resolveImageUrl = (auction) => {
  const raw =
    auction?.productThumbnail ||
    auction?.product?.thumbnail ||
    (auction?.product?.images && auction.product.images.length > 0
      ? auction.product.images[0]?.imageUrl || (typeof auction.product.images[0] === 'string' ? auction.product.images[0] : null)
      : null);

  if (!raw || raw === 'PR') return null;
  if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  return `${base}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f0f4f8'/%3E%3Cstop offset='100%25' stop-color='%23e2e8f0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='400' fill='url(%23g)'/%3E%3Cg transform='translate(300,180)' opacity='0.3'%3E%3Crect x='-30' y='-25' width='60' height='50' rx='4' fill='none' stroke='%2394a3b8' stroke-width='2.5'/%3E%3Ccircle cx='-14' cy='-10' r='5' fill='%2394a3b8'/%3E%3Cpath d='M-25 18 L-8 2 L5 14 L15 6 L28 18' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='300' y='230' text-anchor='middle' font-family='system-ui,sans-serif' font-size='13' fill='%2394a3b8' font-weight='500'%3ENo image available%3C/text%3E%3C/svg%3E";

const AuctionCard = ({ auction }) => {
  const {
    id,
    currentPrice,
    startingPrice,
    status: initialStatus,
    endTime,
    startTime,
    winnerName,
    highestBidderName,
    bidCount = 0,
    totalBids,
  } = auction || {};

  const title = auction?.productTitle || auction?.product?.title || 'Untitled Auction';
  const bids = bidCount || totalBids || 0;

  const [localStatus, setLocalStatus] = useState(initialStatus);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setLocalStatus(initialStatus);
  }, [initialStatus]);

  const isEnded = localStatus === 'ENDED' || localStatus === 'CANCELLED';
  const isLive = localStatus === 'ACTIVE';
  const isUpcoming = localStatus === 'UPCOMING' || localStatus === 'PENDING';
  const hasBids = bids > 0;

  const imgUrl = resolveImageUrl(auction);
  const showImage = imgUrl && !imgError;

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 420,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 8px 16px rgba(0,0,0,0.06)',
        },
        bgcolor: 'background.paper',
      }}
    >
      {/* Image Section */}
      <Link to={`/auctions/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <Box sx={{ height: 200, overflow: 'hidden', position: 'relative', bgcolor: '#f1f5f9' }}>
          {showImage ? (
            <CardMedia
              component="img"
              src={imgUrl}
              alt={title}
              onError={() => setImgError(true)}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
          ) : (
            <Box
              component="img"
              src={PLACEHOLDER_SVG}
              alt="No image"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}

          {/* Status badge — top left */}
          <Box sx={{ position: 'absolute', top: 10, left: 10 }}>
            <AuctionStatusBadge status={localStatus} size="small" />
          </Box>

          {/* Bid count pill — bottom right */}
          {hasBids && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: '#fff',
                px: 1.5,
                py: 0.4,
                borderRadius: 6,
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Users size={12} />
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, lineHeight: 1 }}>
                {bids} bid{bids !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Box>
      </Link>

      {/* Content */}
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1.5 }}>
        {/* Title */}
        <Link to={`/auctions/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: '0.95rem',
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.15s',
            }}
          >
            {title}
          </Typography>
        </Link>

        {/* ── LIVE ── */}
        {isLive && (
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {/* Price + Timer row */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
                  Current Bid
                </Typography>
                <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1}>
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
                  Ends in
                </Typography>
                <Countdown endTime={endTime} status={localStatus} onFinish={() => setLocalStatus('ENDED')} />
              </Box>
            </Box>

            {/* Highest bidder */}
            {(highestBidderName || winnerName) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Gavel size={13} color="#6b7280" />
                <Typography variant="caption" color="text.secondary" fontWeight={500} noWrap>
                  Highest: {highestBidderName || winnerName}
                </Typography>
              </Box>
            )}

            <Button
              component={Link}
              to={`/auctions/${id}`}
              variant="contained"
              size="medium"
              startIcon={<Gavel size={16} />}
              fullWidth
              sx={{
                borderRadius: 2,
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '0.875rem',
                background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1D4ED8 0%, #1e40af 100%)',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.4)',
                },
              }}
            >
              Place Bid
            </Button>
          </Box>
        )}

        {/* ── UPCOMING ── */}
        {isUpcoming && (
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
                  Starting Bid
                </Typography>
                <Typography variant="h6" fontWeight={800} lineHeight={1}>
                  ₹{Number(startingPrice || currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" sx={{ mb: 0.25 }}>
                  Starts in
                </Typography>
                <Countdown endTime={startTime} status={localStatus} onFinish={() => setLocalStatus('ACTIVE')} />
              </Box>
            </Box>
            <Button
              component={Link}
              to={`/auctions/${id}`}
              variant="outlined"
              size="medium"
              startIcon={<Clock size={16} />}
              fullWidth
              sx={{ borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none', fontSize: '0.875rem' }}
            >
              View Preview
            </Button>
          </Box>
        )}

        {/* ── ENDED ── */}
        {isEnded && (
          <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {hasBids ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Trophy size={14} color="#d97706" />
                  <Typography variant="caption" fontWeight={600} color="#d97706" noWrap>
                    {winnerName || 'Winner'}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={800} lineHeight={1.2}>
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {bids} bid{bids !== 1 ? 's' : ''} placed
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No bids were placed
                </Typography>
                <Typography variant="body1" fontWeight={700}>
                  ₹{Number(currentPrice || 0).toLocaleString('en-IN')}
                </Typography>
              </>
            )}
            <Button
              component={Link}
              to={`/auctions/${id}`}
              variant="outlined"
              size="medium"
              startIcon={<Eye size={16} />}
              fullWidth
              sx={{ borderRadius: 2, py: 1, fontWeight: 700, textTransform: 'none', fontSize: '0.875rem', mt: 0.5 }}
            >
              View Results
            </Button>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default AuctionCard;
