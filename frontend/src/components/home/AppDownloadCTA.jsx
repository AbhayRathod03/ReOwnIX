import React from 'react';
import { Box, Typography, Button, Grid, Container } from '@mui/material';
import { Smartphone, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const AppDownloadCTA = () => {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#0F172A', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Gradients */}
      <Box sx={{ position: 'absolute', top: '-50%', left: '-10%', width: '60%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(255,56,92,0.15) 0%, rgba(15,23,42,0) 70%)', transform: 'rotate(30deg)' }} />
      <Box sx={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.15) 0%, rgba(15,23,42,0) 70%)', transform: 'rotate(-30deg)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2, mb: 2, display: 'block' }}>
                REOWNX MOBILE APP
              </Typography>
              <Typography variant="h2" fontWeight="900" sx={{ mb: 3, lineHeight: 1.1, letterSpacing: '-1px' }}>
                The Premium Marketplace, Now in Your Pocket.
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 5, fontWeight: 400, maxWidth: 500 }}>
                Bid on live auctions, negotiate with sellers, and discover rare items instantly with the ReOwnX mobile app.
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<Smartphone size={24} />}
                  sx={{ 
                    bgcolor: 'white', color: '#0F172A', py: 1.5, px: 4, borderRadius: 8, fontWeight: 800,
                    '&:hover': { bgcolor: 'grey.200' }
                  }}
                >
                  Download for iOS
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<Smartphone size={24} />}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.3)', color: 'white', py: 1.5, px: 4, borderRadius: 8, fontWeight: 700,
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Download for Android
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Box sx={{ display: 'inline-block', p: 4, bgcolor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                <QrCode size={180} color="white" strokeWidth={1} />
                <Typography variant="subtitle2" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  Scan to download
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AppDownloadCTA;
