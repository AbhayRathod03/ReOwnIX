import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import productApi from '../../services/productApi';
import ProductCard from '../ProductCard';
import SkeletonBox from '../common/SkeletonBox';
import { useColorMode } from '../../context/ThemeContext';

const RecentlyAdded = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { mode } = useColorMode();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await productApi.getProducts(0, 10, 'createdAt');
        setProducts(data.content || data.items || data || []);
      } catch (err) {
        console.error('Failed to load recent products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 6, px: { xs: 2, md: 4 } }}>
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>Recently Added</Typography>
        <Box sx={{ display: 'flex', gap: 3, overflowX: 'hidden' }}>
          {[1, 2, 3, 4, 5].map(i => <SkeletonBox key={i} height={320} width={280} sx={{ flexShrink: 0, borderRadius: 4 }} />)}
        </Box>
      </Box>
    );
  }

  if (products.length === 0) return null;

  return (
    <Box sx={{ py: 6, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', px: { xs: 2, md: 4 }, mb: 4 }}>
        <Box>
          <Typography variant="h3" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-0.5px' }}>
            <Sparkles size={32} color="#10B981" /> Suggested for You
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>Handpicked items we think you'll love.</Typography>
        </Box>
        <Button 
          component={Link} 
          to="/products" 
          endIcon={<ArrowRight size={18} />}
          sx={{ display: { xs: 'none', sm: 'flex' }, color: 'text.primary', fontWeight: 600, '&:hover': { bgcolor: 'background.default' } }}
        >
          View All
        </Button>
      </Box>

      <Box sx={{ position: 'relative' }}>
        <IconButton 
          onClick={() => scrollBy(-320)} 
          sx={{ 
            position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: { xs: 'none', md: 'flex' }, '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: 3,
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            px: { xs: 2, md: 4 },
            pb: 4
          }}
        >
          {products.map((product) => (
            <Box key={product.id} sx={{ minWidth: 240, maxWidth: 240, flexShrink: 0, height: 380, display: 'flex' }}>
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>

        <IconButton 
          onClick={() => scrollBy(320)} 
          sx={{ 
            position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: { xs: 'none', md: 'flex' }, '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RecentlyAdded;
