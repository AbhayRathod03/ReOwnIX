import React from 'react';
import { Box, Container, Grid, Typography, Button, InputBase, Paper, Chip } from '@mui/material';
import { Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const HeroBanner = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <Box 
      sx={{ 
        bgcolor: '#0f172a', 
        color: 'white', 
        pt: { xs: 8, md: 14 }, 
        pb: { xs: 8, md: 12 },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Abstract Background Shapes */}
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0) 70%)' }} />
      <Box sx={{ position: 'absolute', bottom: -150, left: -50, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography 
              variant="h2" 
              fontWeight="900" 
              sx={{ 
                mb: 2, 
                lineHeight: 1.1,
                fontSize: { xs: '3rem', md: '4.5rem' },
                background: 'linear-gradient(to right, #ffffff, #94a3b8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Discover, Buy & Sell Premium Goods.
            </Typography>
            <Typography variant="h6" color="grey.400" sx={{ mb: 5, fontWeight: 400, maxWidth: '90%', lineHeight: 1.5 }}>
              The ultimate marketplace for luxury watches, electronics, fashion, and collectibles. 
              Bid on live auctions or buy instantly.
            </Typography>

            <Paper 
              component="form"
              onSubmit={handleSearch}
              elevation={0}
              sx={{ 
                p: '4px 4px 4px 16px', 
                display: 'flex', 
                alignItems: 'center', 
                maxWidth: 600, 
                borderRadius: 33,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Search color="#94a3b8" />
              <InputBase
                sx={{ ml: 2, flex: 1, color: 'white' }}
                placeholder="Search products, brands, or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ 
                  borderRadius: 30, 
                  px: 4, 
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
              >
                Search
              </Button>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="grey.500">Popular:</Typography>
              {['Rolex', 'iPhone 15', 'Sneakers', 'PS5'].map(tag => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  component={Link}
                  to={`/products?keyword=${tag}`}
                  clickable 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                  }} 
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box 
              component="img" 
              src="https://images.unsplash.com/photo-1491336477066-31156b5e4f35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Premium Goods"
              sx={{ 
                width: '100%', 
                maxWidth: 500, 
                borderRadius: 4, 
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transform: 'rotate(2deg)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(0deg) scale(1.02)' }
              }} 
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroBanner;
