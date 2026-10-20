import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { useColorMode } from '../../context/ThemeContext';

const CATEGORIES = [
  { id: 1, name: 'Luxury Watches', size: 6, image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=2070&auto=format&fit=crop', link: '/products?category=Watches' },
  { id: 2, name: 'Premium Sneakers', size: 3, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop', link: '/products?category=Sneakers' },
  { id: 3, name: 'Designer Fashion', size: 3, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop', link: '/products?category=Fashion' },
  { id: 4, name: 'Gaming Consoles', size: 4, image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=2019&auto=format&fit=crop', link: '/products?category=Gaming' },
  { id: 5, name: 'Electronics', size: 4, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop', link: '/products?category=Electronics' },
  { id: 6, name: 'Collectibles', size: 4, image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop', link: '/products?category=Collectibles' },
];

const CategoryShowcase = () => {
  const { mode } = useColorMode();
  
  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: mode === 'light' ? '#fff' : 'background.default' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h3" fontWeight="800" sx={{ mb: 1, textAlign: 'center', letterSpacing: '-0.5px' }}>
          Explore Popular Categories
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
          Find exactly what you're looking for among our curated collections.
        </Typography>

        <Grid container spacing={2}>
          {CATEGORIES.map((cat) => (
            <Grid item xs={12} sm={cat.size === 3 ? 6 : cat.size === 4 ? 6 : 12} md={cat.size} key={cat.id}>
              <Box
                component={Link}
                to={cat.link}
                sx={{
                  display: 'block',
                  position: 'relative',
                  height: { xs: 200, md: 300 },
                  borderRadius: 4,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  '&:hover': {
                    '& .cat-image': { transform: 'scale(1.1)' },
                    '& .cat-overlay': { bgcolor: 'rgba(0,0,0,0.3)' }
                  }
                }}
              >
                <Box 
                  className="cat-image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                />
                <Box 
                  className="cat-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.4)',
                    transition: 'background-color 0.3s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    p: 3
                  }}
                >
                  <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {cat.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CategoryShowcase;
