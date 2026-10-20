import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { ShieldCheck, CreditCard, Lock, Gavel, Sparkles, MessageCircle } from 'lucide-react';
import { useColorMode } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const features = [
  { icon: ShieldCheck, title: 'Verified Sellers', desc: 'Every seller undergoes a strict verification process to ensure authenticity.' },
  { icon: CreditCard, title: 'Secure Payments', desc: 'Your money is held safely in escrow until you receive your item.' },
  { icon: Lock, title: 'Buyer Protection', desc: 'Get exactly what you ordered or your money back, guaranteed.' },
  { icon: Gavel, title: 'Real-time Auctions', desc: 'Experience the thrill of live bidding with our WebSocket technology.' },
  { icon: Sparkles, title: 'AI Recommendations', desc: 'Discover products tailored perfectly to your unique taste.' },
  { icon: MessageCircle, title: 'Instant Chat', desc: 'Negotiate and communicate directly with sellers in real-time.' },
];

const WhyReOwnX = () => {
  const { mode } = useColorMode();

  return (
    <Box sx={{ py: 10, px: { xs: 2, md: 4 }, bgcolor: mode === 'light' ? 'grey.50' : 'background.default' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 2, textAlign: 'center', letterSpacing: '-0.5px' }}>
          Why Choose ReOwnIX
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 8, textAlign: 'center', maxWidth: 600, mx: 'auto' }}>
          We provide a premium, secure, and seamless marketplace experience built on trust and cutting-edge technology.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feat, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                style={{ height: '100%' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: mode === 'light' ? 'white' : 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: mode === 'light' ? '0 20px 40px rgba(0,0,0,0.05)' : '0 20px 40px rgba(0,0,0,0.4)',
                    }
                  }}
                >
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.50', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <feat.icon size={28} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" sx={{ mb: 1.5 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default WhyReOwnX;
