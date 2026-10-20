import React from 'react';
import { Box, Container, Grid, Typography, Link as MuiLink, IconButton, Stack, TextField, Button, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import { useColorMode } from '../context/ThemeContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { mode } = useColorMode();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: mode === 'light' ? 'white' : 'background.paper', 
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 8, md: 12 },
        pb: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ mb: 8 }}>
          
          {/* Brand & Description & Newsletter */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  width: 36, height: 36, bgcolor: 'primary.main', color: 'white', 
                  borderRadius: 2, display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', fontWeight: 'bold', mr: 1.5,
                  fontSize: '1.2rem'
                }}
              >
                R
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
                ReOwnIX
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, pr: { md: 4 } }}>
              The world's most trusted premium marketplace for verified second-hand luxury items, electronics, and collectibles.
            </Typography>          </Grid>

          {/* Support */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Support</Typography>
            <Stack spacing={2}>
              {['Help Center', 'Trust & Safety', 'Selling Guide', 'Buying Guide', 'Contact Us'].map(link => (
                <MuiLink key={link} component={Link} to="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.main', transform: 'translateX(4px)' }, transition: 'all 0.2s', fontWeight: 500 }}>
                  {link}
                </MuiLink>
              ))}
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={6} sm={4} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Legal</Typography>
            <Stack spacing={2}>
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map(link => (
                <MuiLink key={link} component={Link} to="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.main', transform: 'translateX(4px)' }, transition: 'all 0.2s', fontWeight: 500 }}>
                  {link}
                </MuiLink>
              ))}
            </Stack>
          </Grid>
          
          {/* Social */}
          <Grid item xs={6} sm={12} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 3 }}>Follow Us</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
                <IconButton key={i} sx={{ bgcolor: mode === 'light' ? 'grey.50' : 'background.default', color: 'text.secondary', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' } }}>
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Stack>
          </Grid>

        </Grid>

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary" fontWeight="500">
            © {currentYear} ReOwnIX. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">English (US)</Typography>
            <Typography variant="caption" color="text.secondary">₹ INR</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;