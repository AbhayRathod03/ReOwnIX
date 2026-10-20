import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Chip, Avatar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({ title: '', content: '', action: null });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getProducts();
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openConfirm = (title, content, action) => {
    setDialogConfig({ title, content, action });
    setDialogOpen(true);
  };

  const handleAction = async () => {
    if (dialogConfig.action) {
      await dialogConfig.action();
    }
    setDialogOpen(false);
  };

  const handleDelete = (id) => {
    const action = async () => {
      try {
        await adminApi.deleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    };

    openConfirm(
      'Delete Product',
      'Are you sure you want to permanently delete this product? This action will remove it from the marketplace entirely.',
      action
    );
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'image', 
      headerName: 'Image', 
      width: 80,
      renderCell: (params) => (
        <Avatar src={params.row.thumbnail || params.row.image} variant="rounded" sx={{ width: 40, height: 40 }} />
      )
    },
    { field: 'title', headerName: 'Title', width: 250 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 120,
      valueFormatter: (params) => {
        if (params == null || params === '') return '';
        return `₹${params.toLocaleString('en-IN')}`;
      }
    },
    { field: 'category', headerName: 'Category', width: 130 },
    { 
      field: 'listingType', 
      headerName: 'Type', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value?.replace('_', ' ')} 
          size="small" 
          color={params.value === 'AUCTION' ? 'secondary' : 'default'} 
          sx={{ fontWeight: 600 }}
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 110,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'ACTIVE' ? 'success' : params.value === 'SOLD' ? 'info' : 'default'} 
          size="small" 
        />
      )
    },
    { 
      field: 'seller', 
      headerName: 'Seller ID', 
      width: 100,
      valueGetter: (params, row) => row.seller?.id || 'N/A'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: '100%' }}>
          <IconButton 
            size="small" 
            component={Link}
            to={`/products/${params.row.id}`}
            target="_blank"
            color="primary"
            title="View Product"
          >
            <ExternalLink size={18} />
          </IconButton>
          <IconButton 
            size="small" 
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Delete Product"
          >
            <Trash2 size={18} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" fontWeight="800" sx={{ mb: 3 }}>Product Management</Typography>
      
      <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={products}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
          }}
          pageSizeOptions={[15, 25, 50]}
          disableRowSelectionOnClick
        />
      </Box>

      <ConfirmDialog 
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleAction}
        title={dialogConfig.title}
        content={dialogConfig.content}
        confirmText="Delete"
        confirmColor="error"
      />
    </Box>
  );
};

export default AdminProducts;
