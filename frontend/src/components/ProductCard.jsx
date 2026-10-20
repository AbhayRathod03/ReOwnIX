// src/components/ProductCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box, Chip, Rating, Avatar, Tooltip, IconButton } from '@mui/material';
import { FavoriteBorder as WishlistIcon, Gavel as AuctionIcon } from '@mui/icons-material';
import { Eye, Edit2, Trash2, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

/**
 * ProductCard renders a product preview.
 *
 * Props:
 *   product       – product data object
 *   footerActions – arbitrary JSX for custom action buttons (legacy)
 *   viewMode      – 'grid' | 'list'
 *   ownerMode     – when true: shows owner-specific UI (status, compact icon actions, no wishlist)
 *   statusBadge   – string status label shown in ownerMode (e.g. 'ACTIVE', 'SOLD')
 *   actionsSlot   – JSX rendered as compact icon-button row in ownerMode
 */
const ProductCard = ({ product, footerActions, viewMode = 'grid', ownerMode = false, statusBadge, actionsSlot, initialInWishlist = false }) => {
  const {
    id = 1,
    title = 'Placeholder Product',
    price = 0,
    image = '/default-product.png',
    condition = 'Used',
    isAuction = false,
    owner,
    thumbnail,
    category = 'Category',
    createdAt,
    viewCount,
    wishlistCount,
    offerCount,
  } = product || {};

  const cardHeight = ownerMode ? '340px' : '380px';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Card
        sx={{
          textDecoration: 'none',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: viewMode === 'list' ? 'row' : 'column',
          height: viewMode === 'list' ? '200px' : cardHeight,
          width: '100%',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Wishlist Floating Button — only in marketplace mode */}
        {!ownerMode && (
          <Box
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              borderRadius: '50%',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: 'white' },
            }}
          >
            <WishlistButton productId={id} initialInWishlist={initialInWishlist} />
          </Box>
        )}

        {/* Badges top-left */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 0.75, zIndex: 10, flexWrap: 'wrap' }}>
          {ownerMode && statusBadge && (
            <Chip
              label={statusBadge}
              size="small"
              sx={{
                bgcolor: statusBadge === 'SOLD' ? '#dcfce7' : statusBadge === 'DRAFT' ? '#f3f4f6' : '#eff6ff',
                color: statusBadge === 'SOLD' ? '#15803d' : statusBadge === 'DRAFT' ? '#6b7280' : '#2563EB',
                fontWeight: 700,
                height: 20,
                fontSize: '0.68rem',
              }}
            />
          )}
          {isAuction && !ownerMode && (
            <Chip
              icon={<AuctionIcon sx={{ fontSize: 14 }} />}
              label="Auction"
              size="small"
              sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600, border: 'none', height: 24 }}
            />
          )}
          {condition && (
            <Chip
              label={condition}
              size="small"
              sx={{ bgcolor: 'rgba(0,0,0,0.7)', color: 'white', backdropFilter: 'blur(4px)', fontWeight: 500, height: 24 }}
            />
          )}
        </Box>

        {/* Product Image */}
        <Box
          component={Link}
          to={`/products/${id}`}
          sx={{
            width: viewMode === 'list' ? 200 : '100%',
            height: viewMode === 'list' ? '100%' : '180px',
            flexShrink: 0,
            overflow: 'hidden',
            bgcolor: 'grey.100',
            display: 'block',
          }}
        >
          <CardMedia
            component="img"
            src={thumbnail || image}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
            alt={title}
            sx={{ objectFit: 'cover', objectPosition: 'center', width: '100%', height: '100%', display: 'block' }}
          />
        </Box>

        {/* Card Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%', height: viewMode === 'list' ? '100%' : 'auto' }}>
          <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* Category & Title */}
            <Box sx={{ minHeight: ownerMode ? '50px' : '60px' }}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 1, mb: 0, display: 'block', lineHeight: 1.2, fontSize: '0.65rem' }}
              >
                {category?.name || category || 'Uncategorized'}
              </Typography>
              <Typography
                component={Link}
                to={`/products/${id}`}
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.2,
                  mt: 0.25,
                  color: 'text.primary',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textDecoration: 'none',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Footer */}
            <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 800, lineHeight: 1 }}>
                ₹{Number(price).toLocaleString('en-IN')}
              </Typography>

              {/* Owner stats (ownerMode) */}
              {ownerMode && (
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  {viewCount !== undefined && (
                    <Typography variant="caption" color="text.secondary">👁 {viewCount}</Typography>
                  )}
                  {wishlistCount !== undefined && (
                    <Typography variant="caption" color="text.secondary">❤ {wishlistCount}</Typography>
                  )}
                  {offerCount !== undefined && (
                    <Typography variant="caption" color="text.secondary">💬 {offerCount}</Typography>
                  )}
                  {createdAt && (
                    <Typography variant="caption" color="text.disabled">
                      {new Date(createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Seller Info (marketplace mode) */}
              {!ownerMode && owner && (
                <Box sx={{ display: 'flex', alignItems: 'center', pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Avatar src={owner.profileImage} sx={{ width: 20, height: 20, mr: 1 }} />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  >
                    {owner.firstName} {owner.lastName}
                  </Typography>
                  <Rating value={4.5} readOnly size="small" sx={{ fontSize: '0.9rem' }} />
                </Box>
              )}
            </Box>

          </CardContent>

          {/* Actions */}
          {ownerMode && actionsSlot && (
            <Box sx={{ px: 1.5, pb: 1.5, pt: 0, borderTop: '1px solid', borderColor: 'divider' }}>
              {actionsSlot}
            </Box>
          )}
          {!ownerMode && footerActions && (
            <Box sx={{ p: 1.5, pt: 0 }}>{footerActions}</Box>
          )}
        </Box>
      </Card>
    </motion.div>
  );
};

export default ProductCard;