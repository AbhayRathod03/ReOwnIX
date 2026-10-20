import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper, Button, Tooltip, IconButton } from '@mui/material';
import { Eye, Edit2, Trash2, Tag } from 'lucide-react';
import productApi from '../services/productApi';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductCard from '../components/ProductCard';

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getMyProducts();
      setProducts(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch your products');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await productApi.deleteProduct(productToDelete.id);
      toast.success('Product deleted successfully');
      setProducts(products.filter(p => p.id !== productToDelete.id));
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this product.');
      } else {
        toast.error('Failed to delete product');
      }
    } finally {
      setDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Page header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800}>My Products</Typography>
        <Button
          component={Link}
          to="/create-product"
          variant="contained"
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
        >
          Sell an Item
        </Button>
      </Box>

      {products.length === 0 ? (
        <Paper
          sx={{ textAlign: 'center', py: 10, borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}
          elevation={0}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't listed any products yet.
          </Typography>
          <Button
            component={Link}
            to="/create-product"
            variant="outlined"
            sx={{ mt: 2, borderRadius: 2, textTransform: 'none' }}
          >
            Create First Listing
          </Button>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 2.5,
            alignItems: 'start',
          }}
        >
          {products.map(product => (
            <Box key={product.id} sx={{ height: '100%' }}>
              <ProductCard
                product={product}
                ownerMode={true}
                statusBadge={product.status || 'ACTIVE'}
                actionsSlot={
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', pt: 1 }}>
                    <Tooltip title="View Listing">
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/products/${product.id}`}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: '#eff6ff' } }}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Product">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/products/edit/${product.id}`)}
                        sx={{ color: 'text.secondary', '&:hover': { color: '#2563EB', bgcolor: '#eff6ff' } }}
                      >
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Offers">
                      <IconButton
                        size="small"
                        component={Link}
                        to={`/profile/my-products/offers/${product.id}`}
                        sx={{ color: 'text.secondary', '&:hover': { color: '#7c3aed', bgcolor: '#f5f3ff' } }}
                      >
                        <Tag size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Product">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(product)}
                        sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: '#fef2f2' } }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />
            </Box>
          ))}
        </Box>
      )}

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Product?"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </Box>
  );
};

export default MyProducts;
