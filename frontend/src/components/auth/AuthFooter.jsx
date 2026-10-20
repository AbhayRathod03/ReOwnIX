import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { Star, MessageCircle, ShieldCheck, HeartHandshake } from 'lucide-react';

const AuthFooter = () => {
  return (
    <Box sx={{ width: '100%', bgcolor: '#ffffff', py: 3, borderTop: '1px solid', borderColor: 'divider' }}>
      <Grid container spacing={2} justifyContent="space-around" alignItems="center">
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#2563EB', borderRadius: '50%', display: 'flex' }}>
            <Star size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>Free to Use</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>No hidden charges</Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#2563EB', borderRadius: '50%', display: 'flex' }}>
            <MessageCircle size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>Chat Safely</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Built-in chat for buyers & sellers</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#2563EB', borderRadius: '50%', display: 'flex' }}>
            <ShieldCheck size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>Safe Transactions</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Report & block suspicious users</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Box sx={{ p: 1.5, bgcolor: '#2563EB', borderRadius: '50%', display: 'flex' }}>
            <HeartHandshake size={20} color="white" />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>Trusted Community</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Millions of users across India</Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthFooter;
