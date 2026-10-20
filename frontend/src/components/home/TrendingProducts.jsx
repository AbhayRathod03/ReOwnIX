import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import { ArrowRight, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../ProductCard';
import productApi from '../../services/productApi';
import SkeletonBox from '../common/SkeletonBox';
import { motion } from 'framer-motion';
import { useColorMode } from '../../context/ThemeContext';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { mode } = useColorMode();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await productApi.getProducts(0, 8, 'createdAt');
        setProducts(data.content || data.items || data || []);
      } catch (err) {
        console.error('Failed to load trending products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <Box sx={{ py: 8, px: { xs: 2, md: 4 }, bgcolor: mode === 'light' ? 'grey.50' : 'background.default' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, maxWidth: 1400, mx: 'auto' }}>
        <Box>
          <Typography variant="h3" fontWeight="800" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, letterSpacing: '-0.5px' }}>
            <Flame size={32} color="#F59E0B" fill="#F59E0B" /> Trending Today
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Highly sought-after items with the most activity right now.
          </Typography>
        </Box>
        <Button 
          component={Link} 
          to="/products" 
          endIcon={<ArrowRight size={18} />}
          sx={{ fontWeight: 600, display: { xs: 'none', sm: 'flex' }, color: 'text.primary', '&:hover': { bgcolor: 'background.paper' } }}
        >
          Explore All
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Grid item xs={6} sm={4} md={3} key={i}>
                <SkeletonBox height={320} sx={{ borderRadius: 4 }} />
              </Grid>
            ))}
          </Grid>
        ) : products.length > 0 ? (
          <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: 3, 
              alignItems: 'start' 
            }}>
              {products.map((product) => (
                <Box key={product.id} sx={{ display: 'flex', height: '100%' }}>
                  <motion.div variants={item} style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <ProductCard product={product} />
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        ) : (
          <Typography color="text.secondary" textAlign="center" py={4}>No trending products available right now.</Typography>
        )}
      </Box>
      
      <Box sx={{ mt: 4, display: { xs: 'flex', sm: 'none' }, justifyContent: 'center' }}>
        <Button component={Link} to="/products" endIcon={<ArrowRight size={16} />}>
          Explore All
        </Button>
      </Box>
    </Box>
  );
};

export default TrendingProducts;
