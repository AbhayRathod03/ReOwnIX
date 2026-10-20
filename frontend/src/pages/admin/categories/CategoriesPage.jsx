// src/pages/admin/categories/CategoriesPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, IconButton, Button, Alert, Stack } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Plus, Pencil, Trash2, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import categoryService from '../../../services/categoryService';
import CategoryDialog from '../../../components/admin/CategoryDialog';
import ConfirmDialog from '../../../components/ConfirmDialog';
import Loading from '../../../components/Loading';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create'); // 'create' | 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getCategories();
      // API returns { content: [...], totalElements, ... }? Align with backend format.
      // For simplicity, handle both shapes.
      const rows = data?.content ?? data ?? [];
      setCategories(rows);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleRefresh = () => {
    fetchCategories();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: '#', width: 80 },
    { field: 'name', headerName: 'Category Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => {
              setSelectedCategory(params.row);
              setDialogMode('edit');
              setDialogOpen(true);
            }}
          >
            <Pencil size={16} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => {
              setCategoryToDelete(params.row);
              setConfirmOpen(true);
            }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleDialogClose = (shouldRefresh) => {
    setDialogOpen(false);
    setSelectedCategory(null);
    if (shouldRefresh) fetchCategories();
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    try {
      await categoryService.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted');
      setConfirmOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Delete failed';
      toast.error(msg);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4, px: { xs: 2, md: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Category Management
        </Typography>
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={handleRefresh} size="large" aria-label="refresh">
            <RefreshCw size={20} />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setDialogMode('create');
              setDialogOpen(true);
            }}
          >
            Add Category
          </Button>
        </Stack>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <Search size={18} style={{ marginRight: 8 }} />
        <TextField
          placeholder="Search categories..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />
      </Box>

      {loading ? (
        <Loading height={400} />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <DataGrid
          rows={filtered}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          disableSelectionOnClick
          getRowId={(row) => row.id}
        />
      )}

      {/* Create / Edit Dialog */}
      {dialogOpen && (
        <CategoryDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          mode={dialogMode}
          category={selectedCategory}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Category"
        description={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`
            : ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  );
};

export default CategoriesPage;
