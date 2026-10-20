import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Grid, Divider, IconButton, InputAdornment } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import { Globe, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthShowcase from '../components/auth/AuthShowcase';
import AuthFooter from '../components/auth/AuthFooter';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup.string().notRequired(),
  address: yup.string().notRequired(),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const { mode } = useColorMode();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const { confirmPassword: _confirmPassword, ...payload } = data;
      const requestPayload = {
        ...payload,
        phone: payload.phone || '',
        address: payload.address || '',
      };
      await registerUser(requestPayload);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: mode === 'light' ? '#F8FAFC' : 'background.default' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
        <Paper elevation={mode === 'light' ? 0 : 2} sx={{ width: '100%', maxWidth: 540, p: { xs: 4, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ letterSpacing: '-0.5px', textAlign: 'center' }}>
              Create an account
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.05rem', textAlign: 'center' }}>
                Join ReOwnIX to buy and sell premium items.
              </Typography>


              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      placeholder="First Name"
                      autoComplete="given-name"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{ 
                        mb: 2, 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                          '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      placeholder="Last Name"
                      autoComplete="family-name"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{ 
                        mb: 2, 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                          '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      placeholder="Email Address"
                      autoComplete="email"
                      {...register('email')}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ 
                        mb: 2, 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                          '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      placeholder="Password"
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 3, 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                          '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        } 
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      placeholder="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ 
                        mb: 3, 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                          '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                          '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                        } 
                      }}
                    />
                  </Grid>
                </Grid>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      py: 1.8,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1.05rem',
                      background: 'linear-gradient(to right, #1D4ED8 0%, #3B82F6 100%)',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                      '&:hover': { boxShadow: '0 12px 32px rgba(37, 99, 235, 0.35)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </motion.div>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 700 }}>
                      Sign in instead
                    </Link>
                  </Typography>
                </Box>
              </Box>

              {/* Security Badge matching mockup */}
              <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: 'rgba(37, 99, 235, 0.05)', borderRadius: 3 }}>
                <ShieldCheck size={24} color="#2563EB" />
                <Box>
                  <Typography variant="body2" fontWeight="700" color="text.primary">We keep your data safe and secure.</Typography>
                  <Typography variant="caption" color="text.secondary">Your privacy is our priority.</Typography>
                </Box>
              </Box>
          </motion.div>
        </Paper>
      </Box>
      <AuthFooter />
    </Box>
  );
};

export default Register;