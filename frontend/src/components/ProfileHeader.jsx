// src/components/ProfileHeader.jsx
import React from 'react';
import { Box, Avatar, Typography, Chip, Button, Stack } from '@mui/material';
import { Edit, AddShoppingCart } from '@mui/icons-material';

/**
 * Header displayed at the top of the profile dashboard.
 * Shows avatar, name, email, member‑since date and key metrics.
 * Includes quick actions: Edit Profile and Sell an Item.
 */
const ProfileHeader = ({ user, stats, onEdit, onSell }) => {
  const memberSince = new Date(user.createdAt || user.joinedAt || Date.now()).toLocaleDateString();
  return (
    <Box sx={{ mb: 4, p: { xs: 2, md: 3 }, bgcolor: 'paper', borderRadius: 2, boxShadow: 1 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
        <Avatar
          src={user.profileImage}
          alt={`${user.firstName} ${user.lastName}`}
          sx={{ width: 80, height: 80 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Member since {memberSince}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Chip label={`Listings: ${stats.products || 0}`} size="small" />
            <Chip label={`Auctions: ${stats.auctions || 0}`} size="small" />
            <Chip label={`Wishlist: ${stats.wishlist || 0}`} size="small" />
            {user.isPremium && <Chip label="Premium" color="secondary" size="small" />}
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<Edit />} onClick={onEdit}>
            Edit Profile
          </Button>
          <Button variant="contained" startIcon={<AddShoppingCart />} onClick={onSell}>
            Sell an Item
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProfileHeader;
