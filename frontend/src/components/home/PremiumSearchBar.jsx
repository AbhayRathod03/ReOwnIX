import React, { useState, useEffect } from 'react';
import { Box, InputBase, IconButton, Divider, Typography, Drawer, useTheme, useMediaQuery } from '@mui/material';
import { Search, MapPin, Mic, SlidersHorizontal, X } from 'lucide-react';
import { useColorMode } from '../../context/ThemeContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FilterSidebar from '../product/FilterSidebar';

const PremiumSearchBar = () => {
  const { mode } = useColorMode();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('keyword') || '');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  
  // Local state for sort and viewMode to keep drawer responsive, synced to URL
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt,desc');
  const [viewMode, setViewMode] = useState(searchParams.get('viewMode') || 'grid');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('keyword') || '');
    setCategoryId(searchParams.get('categoryId') || '');
    setSort(searchParams.get('sort') || 'createdAt,desc');
    setViewMode(searchParams.get('viewMode') || 'grid');
  }, [searchParams]);

  useEffect(() => {
    import('../../services/categoryApi').then(module => {
      const categoryApi = module.default;
      categoryApi.getCategories().then(res => {
        setCategories(res.data || res);
      }).catch(err => console.error("Failed to fetch categories", err));
    });
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchParams.set('keyword', searchTerm.trim());
    } else {
      searchParams.delete('keyword');
    }
    
    if (categoryId) {
      searchParams.set('categoryId', categoryId);
    } else {
      searchParams.delete('categoryId');
    }

    searchParams.set('page', '1');
    navigate(`/products?${searchParams.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleApplyFilters = (filters) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    // Ensure current sort & viewMode are applied
    newParams.set('sort', sort);
    newParams.set('viewMode', viewMode);
    
    newParams.set('page', '1');
    setDrawerOpen(false);
    navigate(`/products?${newParams.toString()}`);
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    newParams.set('page', '1');
    navigate(`/products?${newParams.toString()}`);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('viewMode', newViewMode);
    navigate(`/products?${newParams.toString()}`);
  };

  const initialFilters = {
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    listingType: searchParams.get('listingType') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    brand: searchParams.get('brand') || '',
    myProducts: searchParams.get('myProducts') === 'true'
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, px: 2, maxWidth: 700, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 800,
          bgcolor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: 8,
          boxShadow: mode === 'light' 
            ? '0 20px 40px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)' 
            : '0 20px 40px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.2)',
          border: '1px solid',
          borderColor: 'divider',
          p: 0.5,
        }}
      >
        {/* Category Dropdown Section */}
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', px: 2 }}>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              color: theme.palette.text.primary,
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              maxWidth: '120px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 1, display: { xs: 'none', sm: 'block' } }} />

        {/* Main Search Input */}
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1, color: 'text.primary', mb: 0.5 }}>Find Products</Typography>
            <InputBase
              placeholder="Search watches, sneakers, gaming..."
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ 
                p: 0, 
                color: 'text.secondary', 
                fontSize: '0.9rem',
                '& input': { p: 0, '&::placeholder': { opacity: 0.7 } } 
              }}
            />
          </Box>
        </Box>

        {/* Filter Button */}
        <IconButton size="large" onClick={() => setDrawerOpen(true)} sx={{ 
          bgcolor: 'background.default', 
          mr: 1,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'divider' }
        }}>
          <SlidersHorizontal size={20} />
        </IconButton>

        {/* Search Action Button */}
        <Box
          onClick={handleSearch}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, background 0.2s',
            background: 'linear-gradient(to right, #1D4ED8 0%, #3B82F6 100%)',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Search size={18} />
        </Box>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor={isMobile ? 'bottom' : 'right'}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 380,
            height: isMobile ? '90vh' : '100%',
            borderTopLeftRadius: isMobile ? 24 : 0,
            borderTopRightRadius: isMobile ? 24 : 0,
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" fontWeight="800">Advanced Filters</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <FilterSidebar 
            onApplyFilters={handleApplyFilters} 
            initialFilters={initialFilters} 
            sort={sort}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </Box>
      </Drawer>
    </Box>
  );
};

export default PremiumSearchBar;
