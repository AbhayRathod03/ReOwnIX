import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Users, Package, Tag, Gavel, PlayCircle, StopCircle, DollarSign, Clock, Check, Star, Heart, MessageCircle } from 'lucide-react';
import adminApi from '../../services/adminApi';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        borderRadius: 4, 
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: '50%', 
            bgcolor: `${color}15`, 
            color: color,
            display: 'flex',
            mr: 3
          }}
        >
          <Icon size={32} />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="900" color="text.primary">
            {value != null ? value.toLocaleString('en-IN') : 0}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const stats = await adminApi.getDashboard();
        setData(stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  const statConfig = [
    { title: 'Total Users', value: data?.totalUsers, icon: Users, color: '#3B82F6' },
    { title: 'Total Products', value: data?.totalProducts, icon: Package, color: '#8B5CF6' },
    { title: 'Categories', value: data?.totalCategories || 0, icon: Tag, color: '#EC4899' },
    
    { title: 'Total Auctions', value: data?.totalAuctions, icon: Gavel, color: '#F59E0B' },
    { title: 'Active Auctions', value: data?.activeAuctions, icon: PlayCircle, color: '#10B981' },
    { title: 'Ended Auctions', value: data?.completedAuctions, icon: StopCircle, color: '#EF4444' },

    { title: 'Total Offers', value: (data?.pendingOffers || 0) + (data?.acceptedOffers || 0), icon: DollarSign, color: '#06B6D4' },
    { title: 'Pending Offers', value: data?.pendingOffers, icon: Clock, color: '#F97316' },
    { title: 'Accepted Offers', value: data?.acceptedOffers, icon: Check, color: '#14B8A6' },

    { title: 'Reviews', value: data?.reviews, icon: Star, color: '#EAB308' },
    { title: 'Wishlist Items', value: data?.totalWishlistItems, icon: Heart, color: '#F43F5E' },
    { title: 'Chat Messages', value: data?.messages, icon: MessageCircle, color: '#6366F1' },
  ];

  return (
    <Box sx={{ p: { xs: 2, md: 4, lg: 6 }, maxWidth: 1400, mx: 'auto' }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="900" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Platform Overview and Real-time Statistics
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
