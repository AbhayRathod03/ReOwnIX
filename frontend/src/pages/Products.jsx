import React, { useEffect, useState, useCallback } from 'react';
import { 
  Box, Container, Grid, Typography, 
  Skeleton, Paper, Button
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import productApi from '../services/productApi';
import toast from 'react-hot-toast';
import PaginationControls from '../components/PaginationControls';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';

const DEFAULT_PAGE_SIZE = 12;

const Products = () => {
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL Params parsing (Source of Truth)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'createdAt,desc';
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const brand = searchParams.get('brand') || '';
  const condition = searchParams.get('condition') || '';
  const listingType = searchParams.get('listingType') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const myProducts = searchParams.get('myProducts') === 'true';
  const viewMode = searchParams.get('viewMode') || 'grid';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page - 1, // Backend is 0-indexed
        size: pageSize,
        sortBy: sort,
      };

      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (brand) params.brand = brand;
      if (condition) params.condition = condition;
      if (listingType) params.listingType = listingType;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (myProducts) params.myProducts = myProducts;

      const data = await productApi.getProducts(params);
      
      if (data && data.content) {
        setProducts(data.content);
        setTotal(data.totalElements);
      } else {
        setProducts(Array.isArray(data) ? data : []);
        setTotal(Array.isArray(data) ? data.length : 0);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sort, keyword, categoryId, brand, condition, listingType, minPrice, maxPrice, myProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Scroll to top when the page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const updateSortAndPage = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') newParams.set('page', '1'); 
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / pageSize);

  const renderSkeletons = () => (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: viewMode === 'grid' 
        ? { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } 
        : '1fr', 
      gap: 3, 
      alignItems: 'start' 
    }}>
      {Array.from({ length: pageSize }).map((_, idx) => (
        <Paper key={idx} sx={{ p: 2, borderRadius: 3, height: viewMode === 'grid' ? 380 : 200 }} elevation={0}>
          <Skeleton variant="rectangular" height={viewMode === 'grid' ? 180 : '100%'} />
          <Box sx={{ pt: 1 }}>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pt: 4, pb: 10 }}>
      <Container maxWidth="xl">
        <Typography variant="h4" fontWeight="800" sx={{ mb: 4 }}>
          Browse Products
        </Typography>

        <Grid container spacing={3}>
          {/* Main Content (Full Width) */}
          <Grid item xs={12}>

            {/* Product List */}
            {loading ? (
              renderSkeletons()
            ) : products.length > 0 ? (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Showing {products.length} of {total} products
                </Typography>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: viewMode === 'grid' 
                    ? { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } 
                    : '1fr', 
                  gap: 3, 
                  alignItems: 'start' 
                }}>
                  {products.map(product => (
                    <Box key={product.id} sx={{ height: '100%' }}>
                      <ProductCard product={product} viewMode={viewMode} />
                    </Box>
                  ))}
                </Box>
                
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <PaginationControls
                      page={page}
                      totalPages={totalPages}
                      onPageChange={(e, v) => updateSortAndPage('page', v.toString())}
                      pageSize={pageSize}
                      pageSizeOptions={[12, 24, 48]}
                      onPageSizeChange={(e) => setPageSize(parseInt(e.target.value))}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Paper sx={{ textAlign: 'center', py: 12, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }} elevation={0}>
                <Typography variant="h5" color="text.primary" fontWeight="700" sx={{ mb: 1 }}>No products found.</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>Try changing your filters or search term to find what you're looking for.</Typography>
                <Button variant="outlined" color="primary" onClick={handleClearFilters}>
                  Clear Search & Filters
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Products;