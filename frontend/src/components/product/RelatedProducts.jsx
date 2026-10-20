import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import productApi from '../../services/productApi';
import ProductCard from '../ProductCard';

const RelatedProducts = ({ currentProductId, category }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // Note: No backend endpoint for related products yet. 
        // Fetching top recent products and filtering out the current one.
        const res = await productApi.getProducts(0, 10);
        let products = res?.content || res || [];
        
        // Remove current product and limit to 4
        products = products.filter(p => String(p.id) !== String(currentProductId)).slice(0, 4);
        
        setRelated(products);
      } catch (err) {
        console.error('Failed to load related products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [currentProductId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (related.length === 0) {
    return null; // Hide section if no related products
  }

  return (
    <Box sx={{ mt: 6, mb: 8 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 4, display: 'inline-block', borderBottom: '2px solid', borderColor: 'primary.main', pb: 1 }}>
        Related Products
      </Typography>
      
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: 3, 
        alignItems: 'start' 
      }}>
        {related.map((prod) => (
          <Box key={prod.id} sx={{ height: '100%' }}>
            <ProductCard product={prod} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RelatedProducts;
