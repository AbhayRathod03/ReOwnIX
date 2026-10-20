import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Button, Paper } from '@mui/material';
import { Timer, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../ProductCard';
import productApi from '../../services/productApi';

const FlashDeals = () => {
  const [products, setProducts] = useState([]);
  
  // Dummy countdown timer (e.g. 12h 45m 30s)
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    // Tick down timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          s = 59;
          if (m > 0) m--;
          else {
            m = 59;
            if (h > 0) h--;
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await productApi.getProducts(0, 4);
        // Pretend these are flash deals
        setProducts(data.content || data.items || data || []);
      } catch (err) {
        console.error('Failed to load flash deals', err);
      }
    };
    fetchDeals();
  }, []);

  if (products.length === 0) return null;

  return (
    <Box sx={{ py: 10, bgcolor: '#0f172a', color: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'flex-end' }, mb: 6, gap: 3 }}>
          <Box>
            <Typography variant="h3" fontWeight="900" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Zap color="#f59e0b" size={40} fill="#f59e0b" /> Flash Deals
            </Typography>
            <Typography variant="h6" color="grey.400" fontWeight="400">
              Unbeatable prices. Limited time only.
            </Typography>
          </Box>
          
          <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, backdropFilter: 'blur(10px)' }}>
            <Typography variant="subtitle2" color="grey.300" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Timer size={16} /> Ends in:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Box sx={{ p: 1, px: 1.5, bgcolor: 'white', color: 'black', borderRadius: 1, fontWeight: 'bold' }}>{String(timeLeft.h).padStart(2, '0')}h</Box>
              <Box sx={{ p: 1, px: 1.5, bgcolor: 'white', color: 'black', borderRadius: 1, fontWeight: 'bold' }}>{String(timeLeft.m).padStart(2, '0')}m</Box>
              <Box sx={{ p: 1, px: 1.5, bgcolor: 'error.main', color: 'white', borderRadius: 1, fontWeight: 'bold' }}>{String(timeLeft.s).padStart(2, '0')}s</Box>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
          gap: 3, 
          alignItems: 'start' 
        }}>
          {products.slice(0, 4).map((product) => (
            <Box key={product.id} sx={{ '& .MuiPaper-root': { border: 'none' }, height: '100%' }}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
        
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/products?deal=flash" 
            variant="outlined" 
            size="large"
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)', 
              px: 6, 
              py: 1.5,
              borderRadius: 30,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            View All Deals
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FlashDeals;
