import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { paymentService } from '../services/dotnet/paymentService';
import { subscriptionService } from '../services/dotnet/subscriptionService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = location.state?.plan;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    cardNumber: false,
    expiry: false,
    cvv: false
  });

  const inputRefs = {
    name: useRef(null),
    cardNumber: useRef(null),
    expiry: useRef(null),
    cvv: useRef(null)
  };

  // If accessed directly without a plan, redirect back to premium page
  if (!plan) {
    return <Navigate to="/premium" replace />;
  }

  // --- Formatting Helpers ---
  
  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  // --- Validation Logic ---

  const validateField = (name, value) => {
    let error = '';
    const trimmed = value.trim();

    switch (name) {
      case 'name':
        if (!trimmed) error = 'Cardholder name is required.';
        else if (trimmed.length < 2) error = 'Please enter a valid cardholder name.';
        break;
      case 'cardNumber':
        const cardDigits = trimmed.replace(/\D/g, '');
        if (!cardDigits) error = 'Card number is required.';
        else if (cardDigits.length < 15 || cardDigits.length > 16) error = 'Card number must contain 15 or 16 digits.';
        break;
      case 'expiry':
        if (!trimmed) error = 'Expiry date is required.';
        else if (trimmed.length !== 5) error = 'Enter a valid expiry date (MM/YY).';
        else {
          const [month, year] = trimmed.split('/');
          const m = parseInt(month, 10);
          const y = parseInt(year, 10);
          if (m < 1 || m > 12) error = 'Enter a valid expiry date.';
          else {
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (y < currentYear || (y === currentYear && m < currentMonth)) {
              error = 'Card has expired.';
            }
          }
        }
        break;
      case 'cvv':
        const cvvDigits = trimmed.replace(/\D/g, '');
        if (!cvvDigits) error = 'CVV is required.';
        else if (cvvDigits.length < 3 || cvvDigits.length > 4) error = 'CVV must contain 3 or 4 digits.';
        break;
      default:
        break;
    }
    return error;
  };

  // Run validation when form data changes if field was touched
  useEffect(() => {
    const newErrors = { ...errors };
    Object.keys(touched).forEach(key => {
      if (touched[key]) {
        newErrors[key] = validateField(key, formData[key]);
      }
    });
    setErrors(newErrors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, touched]);


  // --- Event Handlers ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'name') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '').slice(0, 50);
    } else if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setFormData(prev => ({ ...prev, [name]: prev[name].trim() }));
  };

  const isFormValid = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      cardNumber: validateField('cardNumber', formData.cardNumber),
      expiry: validateField('expiry', formData.expiry),
      cvv: validateField('cvv', formData.cvv)
    };
    
    return !Object.values(newErrors).some(err => err !== '');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors = {
      name: validateField('name', formData.name),
      cardNumber: validateField('cardNumber', formData.cardNumber),
      expiry: validateField('expiry', formData.expiry),
      cvv: validateField('cvv', formData.cvv)
    };
    
    setErrors(newErrors);
    setTouched({ name: true, cardNumber: true, expiry: true, cvv: true });

    const firstInvalid = Object.keys(newErrors).find(key => newErrors[key] !== '');
    if (firstInvalid) {
      inputRefs[firstInvalid].current?.focus();
      return;
    }

    setLoading(true);

    try {
      // 1. Process Payment (.NET Payment Controller)
      const paymentPayload = {
        userId: user.userId,
        planId: plan.planId,
        amount: plan.price,
        paymentMethod: 'Credit Card',
      };
      
      const paymentRes = await paymentService.processPayment(paymentPayload);
      
      if (!paymentRes?.success) {
        throw new Error(paymentRes?.message || 'Payment failed');
      }

      // 2. Activate Subscription (.NET Subscription Controller)
      const subPayload = {
        userId: user.userId,
        planId: plan.planId,
      };

      await subscriptionService.purchaseSubscription(subPayload);

      toast.success('Subscription activated successfully!');
      navigate('/profile/subscription');

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || error.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Checkout
      </Typography>
      
      <Grid container spacing={4}>
        {/* Payment Form */}
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, elevation: 0, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Payment Details
              </Typography>
              <form onSubmit={handleCheckout} noValidate>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={inputRefs.name}
                      fullWidth
                      label="Name on Card"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      autoComplete="cc-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={inputRefs.cardNumber}
                      fullWidth
                      label="Card Number"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
                      required
                      placeholder="XXXX XXXX XXXX XXXX"
                      inputProps={{ inputMode: 'numeric' }}
                      autoComplete="cc-number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      inputRef={inputRefs.expiry}
                      fullWidth
                      label="Expiry (MM/YY)"
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.expiry}
                      helperText={errors.expiry}
                      required
                      placeholder="MM/YY"
                      inputProps={{ inputMode: 'numeric' }}
                      autoComplete="cc-exp"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      inputRef={inputRefs.cvv}
                      fullWidth
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!errors.cvv}
                      helperText={errors.cvv}
                      required
                      placeholder="123"
                      inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                      autoComplete="cc-csc"
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || (!isFormValid() && Object.values(touched).some(t => t))}
                  sx={{ mt: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${Number(plan.price).toLocaleString('en-IN')}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, bgcolor: '#F8FAFC', elevation: 0, border: '1px solid', borderColor: 'divider' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Order Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">{plan.planName}</Typography>
                <Typography fontWeight="bold">₹{Number(plan.price).toLocaleString('en-IN')}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Duration</Typography>
                <Typography>{plan.durationDays} days</Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">₹{Number(plan.price).toLocaleString('en-IN')}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
