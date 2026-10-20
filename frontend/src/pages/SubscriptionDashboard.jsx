import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  LinearProgress,
  Chip
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { subscriptionService } from '../services/dotnet/subscriptionService';
import toast from 'react-hot-toast';

const SubscriptionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const res = await subscriptionService.getUserSubscription(user.id);
      setSubscription(res?.data || res);
    } catch (error) {
      console.error('Failed to load subscription:', error);
      // It might return 404 if no subscription exists, which is fine
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      await subscriptionService.cancelSubscription(user.id);
      toast.success('Subscription cancelled');
      fetchSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleRenew = async () => {
    try {
      await subscriptionService.renewSubscription(user.id);
      toast.success('Subscription renewed successfully!');
      fetchSubscription();
    } catch (error) {
      toast.error('Failed to renew subscription');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!subscription) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>No Active Subscription</Typography>
        <Typography color="text.secondary" paragraph>
          You are currently using the Free Tier (10 views max).
        </Typography>
        <Button variant="contained" onClick={() => navigate('/premium')} sx={{ mt: 2 }}>
          View Premium Plans
        </Button>
      </Box>
    );
  }

  const { planName, productsViewed, productLimit, status, endDate } = subscription;
  const viewsRemaining = Math.max(0, productLimit - productsViewed);
  const progressPercent = Math.min(100, (productsViewed / productLimit) * 100);
  const isExpired = new Date(endDate) < new Date() || status === 'Cancelled';

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">My Subscription</Typography>
        <Chip 
          label={status} 
          color={isExpired ? 'error' : 'success'} 
          variant="filled" 
          sx={{ fontWeight: 'bold' }} 
        />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, elevation: 0, border: '1px solid #E2E8F0', mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography color="text.secondary" gutterBottom>Current Plan</Typography>
              <Typography variant="h4" fontWeight="bold" gutterBottom>{planName}</Typography>
              
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">Product Views Used</Typography>
                  <Typography variant="body2">{productsViewed} / {productLimit}</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={progressPercent} 
                  color={progressPercent > 90 ? 'error' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {viewsRemaining} views remaining
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, elevation: 0, border: '1px solid #E2E8F0', height: '100%' }}>
            <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography color="text.secondary" gutterBottom>Expiration Date</Typography>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {new Date(endDate).toLocaleDateString()}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              {!isExpired && (
                <Button 
                  fullWidth 
                  variant="outlined" 
                  color="error" 
                  onClick={handleCancel}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Cancel Subscription
                </Button>
              )}
              {isExpired && (
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={handleRenew}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Renew Now
                </Button>
              )}
              <Button 
                  fullWidth 
                  variant={isExpired ? "outlined" : "contained"} 
                  onClick={() => navigate('/premium')}
                  sx={{ mt: 2, borderRadius: 2 }}
                >
                  Change Plan
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SubscriptionDashboard;
