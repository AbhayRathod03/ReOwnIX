import React from 'react';
import { Box, Paper, Typography, Avatar, Button, Grid, Divider } from '@mui/material';
import { MessageCircle, MapPin, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellerInfoCard = ({ owner, onStartChat, hasAcceptedOffer }) => {
  if (!owner) return null;

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Seller Information
      </Typography>
      
      <Grid container spacing={3} alignItems="center">
        {/* Profile Info */}
        <Grid item xs={12} sm={8} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              src={owner.profileImage} 
              sx={{ width: 80, height: 80, bgcolor: 'primary.100', color: 'primary.main', fontSize: '2rem', fontWeight: 'bold' }}
            >
              {owner.name?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {owner.name || owner.firstName + ' ' + owner.lastName || 'Unknown Seller'}
                {owner.verified && <ShieldCheck size={20} color="#10b981" />}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#f59e0b', mt: 0.5 }}>
                <Star size={16} fill="currentColor" />
                <Typography variant="body2" fontWeight="bold" color="text.primary">
                  {owner.rating ? owner.rating.toFixed(1) : 'New'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ({owner.reviewsCount || 0} reviews)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Member since {owner.memberSince ? new Date(owner.memberSince).getFullYear() : new Date().getFullYear()}
              </Typography>

              {hasAcceptedOffer && (
                <Box sx={{ mt: 2, p: 1.5, bgcolor: 'success.50', borderRadius: 2, border: '1px solid', borderColor: 'success.200' }}>
                  <Typography variant="subtitle2" color="success.800" fontWeight="bold" sx={{ mb: 0.5 }}>
                    Accepted Offer - Contact Info
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <strong>Email:</strong> {owner.email || 'Not provided'}
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    <strong>Phone:</strong> {owner.phone || 'Not provided'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Stats / Action */}
        <Grid item xs={12} sm={4} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 2 }}>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <MapPin size={16} /> Location: {owner.address || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Listings: {owner.listingCount || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                component={Link} 
                to={`/seller/${owner.id}`}
                sx={{ borderRadius: 2, textTransform: 'none' }}
              >
                View Profile
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SellerInfoCard;
