import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Check as CheckIcon } from 'lucide-react';
import { planService } from '../services/dotnet/planService';
import toast from 'react-hot-toast';

const PremiumPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planService.getAllPlans();
      // The API wraps data in response.data or response
      const planData = response?.data || response;
      setPlans(planData);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      toast.error('Failed to load premium plans.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    // Navigate to checkout and pass the selected plan
    navigate('/checkout', { state: { plan } });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Upgrade to ReOwnIX Premium
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Unlock more product views and elevate your marketplace experience.
        </Typography>
      </Box>

      {plans.length === 0 ? (
        <Typography align="center" color="text.secondary">No plans currently available.</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {plans.map((plan) => (
            <Grid item key={plan.planId} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 4 }}>
                  <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
                    {plan.planName}
                  </Typography>
                  <Typography variant="h3" color="primary" fontWeight="bold" sx={{ my: 2 }}>
                    ₹{plan.price}
                    <Typography variant="subtitle1" component="span" color="text.secondary">
                      /{plan.durationDays} days
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description}
                  </Typography>

                  <List sx={{ mt: 2 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon size={20} color="#10B981" />
                      </ListItemIcon>
                      <ListItemText primary={`Up to ${plan.productLimit} Product Views`} />
                    </ListItem>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckIcon size={20} color="#10B981" />
                      </ListItemIcon>
                      <ListItemText primary="Premium Support" />
                    </ListItem>
                  </List>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button 
                    fullWidth 
                    variant={plan.price > 1000 ? "contained" : "outlined"} 
                    size="large"
                    onClick={() => handleSelectPlan(plan)}
                    sx={{ borderRadius: 2 }}
                  >
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default PremiumPlans;
