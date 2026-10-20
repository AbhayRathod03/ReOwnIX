import React from 'react';
import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { ShieldCheck, Tag, MapPin, CheckCircle2 } from 'lucide-react';

const AuthShowcase = () => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        minHeight: '100vh',
        bgcolor: '#F8FAFC', // Soft off-white matching mockup
        p: { md: 6, lg: 8 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Section */}
      <Box sx={{ zIndex: 2, position: 'relative' }}>

        
        <Chip 
          icon={<ShieldCheck size={16} color="#2563EB" />} 
          label="India's trusted marketplace for pre-owned items" 
          sx={{ 
            bgcolor: 'rgba(37, 99, 235, 0.1)', 
            color: 'primary.main', 
            fontWeight: 600,
            mb: 4,
            px: 1
          }} 
        />

        <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.1, color: 'text.primary', maxWidth: '400px' }}>
          Buy. Sell. Find Great Deals
        </Typography>

        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 6, maxWidth: '400px', fontSize: '1.1rem' }}>
          From used mobiles to furniture, cars to bikes, we make second-hand simple.
        </Typography>

        {/* Features Grid */}
        <Grid container spacing={4} sx={{ maxWidth: '500px', mb: 8 }}>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
              <Tag size={24} color="#2563EB" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Buy Smart</Typography>
            <Typography variant="body2" color="text.secondary">Find quality used items at great prices.</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
              <Tag size={24} color="#2563EB" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Sell Fast</Typography>
            <Typography variant="body2" color="text.secondary">List in minutes and sell near you.</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
              <MapPin size={24} color="#2563EB" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Local & Safe</Typography>
            <Typography variant="body2" color="text.secondary">Connect with verified buyers and sellers.</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ bgcolor: 'rgba(37, 99, 235, 0.1)', p: 1.5, borderRadius: 3, display: 'inline-flex', mb: 2 }}>
              <CheckCircle2 size={24} color="#2563EB" />
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Secure & Reliable</Typography>
            <Typography variant="body2" color="text.secondary">Safer conversations, smarter transactions.</Typography>
          </Grid>
        </Grid>
      </Box>



      {/* Stats Row */}
      <Box sx={{ zIndex: 2, position: 'relative' }}>
        <Paper elevation={0} sx={{ display: 'flex', justifyContent: 'space-between', p: 3, borderRadius: 4, bgcolor: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>10L+</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>Happy Buyers</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>25L+</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>Items Listed</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>500+</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>Cities</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800 }}>100%</Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>Free to Use</Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AuthShowcase;
