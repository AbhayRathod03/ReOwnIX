import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Box, Button, TextField, Typography, Paper, Grid, Divider, IconButton, InputAdornment } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useColorMode } from '../context/ThemeContext';
import { Globe, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthShowcase from '../components/auth/AuthShowcase';
import AuthFooter from '../components/auth/AuthFooter';

const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const { mode } = useColorMode();
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      navigate(from.pathname, { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', bgcolor: mode === 'light' ? '#F8FAFC' : 'background.default' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 2, md: 4 } }}>
        <Paper elevation={mode === 'light' ? 0 : 2} sx={{ width: '100%', maxWidth: 440, p: { xs: 4, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Typography variant="h4" fontWeight="900" gutterBottom sx={{ letterSpacing: '-0.5px', textAlign: 'center' }}>
              Welcome back!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4, fontSize: '1.05rem', textAlign: 'center' }}>
                Login to continue to ReOwnIX
              </Typography>


              <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  required
                  fullWidth
                  id="email"
                  placeholder="Email address"
                  autoComplete="email"
                  autoFocus
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ 
                    mb: 3, 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                      '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                    } 
                  }}
                />
                
                <TextField
                  required
                  fullWidth
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
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
                    mb: 2, 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3, bgcolor: mode === 'light' ? '#ffffff' : 'rgba(0,0,0,0.2)',
                      '&:hover fieldset': { borderColor: 'primary.main', opacity: 0.5 },
                      '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '2px' }
                    } 
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input type="checkbox" id="remember" style={{ cursor: 'pointer', accentColor: '#2563EB', width: '16px', height: '16px' }} />
                    <Typography component="label" htmlFor="remember" variant="body2" sx={{ cursor: 'pointer', color: 'text.primary', fontWeight: 600 }}>Remember me</Typography>
                  </Box>
                  <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
                    Forgot password?
                  </Typography>
                </Box>
                
                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      py: 1.8,
                      borderRadius: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1.05rem',
                      background: 'linear-gradient(to right, #1D4ED8 0%, #3B82F6 100%)', // Blue primary gradient
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                      '&:hover': { boxShadow: '0 12px 32px rgba(37, 99, 235, 0.35)' },
                      transition: 'all 0.3s'
                    }}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </motion.div>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#2563EB', textDecoration: 'none', fontWeight: 700 }}>
                      Sign up
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

export default Login;