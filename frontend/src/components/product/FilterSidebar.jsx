import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, FormControl, InputLabel, Select, MenuItem, Slider, TextField, Button, Switch, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Package, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import categoryApi from '../../services/categoryApi';

const FilterSidebar = ({ onApplyFilters, initialFilters = {}, sort = 'createdAt,desc', onSortChange, viewMode = 'grid', onViewModeChange }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  
  const [filters, setFilters] = useState({
    categoryId: '',
    condition: '',
    listingType: '',
    minPrice: 0,
    maxPrice: 100000,
    brand: '',
    myProducts: false,
    ...initialFilters
  });

  useEffect(() => {
    // Parse numeric fields safely
    setFilters({
      ...initialFilters,
      minPrice: initialFilters.minPrice ? parseInt(initialFilters.minPrice, 10) : 0,
      maxPrice: initialFilters.maxPrice ? parseInt(initialFilters.maxPrice, 10) : 100000,
      myProducts: initialFilters.myProducts === true || initialFilters.myProducts === 'true'
    });
  }, [initialFilters]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data || response);
      } catch (err) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters({
      categoryId: filters.categoryId,
      condition: filters.condition,
      listingType: filters.listingType,
      brand: filters.brand,
      minPrice: filters.minPrice.toString(),
      maxPrice: filters.maxPrice.toString(),
      myProducts: filters.myProducts ? 'true' : ''
    });
  };

  const handleReset = () => {
    const defaultFilters = { categoryId: '', condition: '', listingType: '', minPrice: 0, maxPrice: 100000, brand: '', myProducts: false };
    setFilters(defaultFilters);
    onApplyFilters({
      categoryId: '', condition: '', listingType: '', brand: '', minPrice: '', maxPrice: '', myProducts: ''
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>

      {/* Sort By + View Toggle — moved from top bar */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <FormControl fullWidth size="small">
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => onSortChange && onSortChange(e.target.value)}>
            <MenuItem value="createdAt,desc">Newest First</MenuItem>
            <MenuItem value="createdAt,asc">Oldest First</MenuItem>
            <MenuItem value="price,asc">Price: Low to High</MenuItem>
            <MenuItem value="price,desc">Price: High to Low</MenuItem>
            <MenuItem value="title,asc">Name: A to Z</MenuItem>
            <MenuItem value="title,desc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>View</Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, val) => onViewModeChange && onViewModeChange(val)}
            size="small"
          >
            <ToggleButton value="grid" aria-label="grid view" sx={{ px: 1.5 }}>
              <LayoutGrid size={16} />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view" sx={{ px: 1.5 }}>
              <ListIcon size={16} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box sx={{ p: 2.5, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Package size={20} color="#666" />
              <Typography variant="subtitle2" fontWeight="600">My Products</Typography>
            </Box>
            <Switch 
              checked={filters.myProducts} 
              onChange={(e) => handleChange('myProducts', e.target.checked)} 
              color="primary"
            />
          </Box>
        )}

        <FormControl fullWidth size="small">
          <InputLabel>Category</InputLabel>
          <Select value={filters.categoryId || ''} label="Category" onChange={(e) => handleChange('categoryId', e.target.value)}>
            <MenuItem value=""><em>All Categories</em></MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Condition</InputLabel>
          <Select value={filters.condition || ''} label="Condition" onChange={(e) => handleChange('condition', e.target.value)}>
            <MenuItem value=""><em>Any Condition</em></MenuItem>
            <MenuItem value="NEW">New</MenuItem>
            <MenuItem value="LIKE_NEW">Like New</MenuItem>
            <MenuItem value="GOOD">Good</MenuItem>
            <MenuItem value="FAIR">Fair</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Listing Type</InputLabel>
          <Select value={filters.listingType || ''} label="Listing Type" onChange={(e) => handleChange('listingType', e.target.value)}>
            <MenuItem value=""><em>Any Type</em></MenuItem>
            <MenuItem value="FIXED_PRICE">Fixed Price</MenuItem>
            <MenuItem value="AUCTION">Auction</MenuItem>
          </Select>
        </FormControl>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>Price Range (₹)</Typography>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={(e, val) => {
              handleChange('minPrice', val[0]);
              handleChange('maxPrice', val[1]);
            }}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={1000}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 1 }}>
            <TextField 
              size="small" 
              type="number"
              value={filters.minPrice} 
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                handleChange('minPrice', Math.min(val, filters.maxPrice));
              }} 
            />
            <TextField 
              size="small" 
              type="number"
              value={filters.maxPrice} 
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                handleChange('maxPrice', Math.max(val, filters.minPrice));
              }} 
            />
          </Box>
        </Box>

        <TextField
          fullWidth
          size="small"
          label="Search Brand"
          value={filters.brand || ''}
          onChange={(e) => handleChange('brand', e.target.value)}
        />
      </Box>

      {/* Sticky Bottom Actions */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', position: 'sticky', bottom: 0, display: 'flex', gap: 2 }}>
        <Button variant="outlined" fullWidth onClick={handleReset}>Reset</Button>
        <Button variant="contained" color="primary" fullWidth onClick={handleApply}>Apply Filters</Button>
      </Box>
    </Box>
  );
};

export default FilterSidebar;
