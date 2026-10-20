// src/components/admin/CategoryDialog.jsx
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import categoryService from '../../services/categoryService';
import { Plus, Pencil } from 'lucide-react';

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required('Category name is required'),
  description: yup.string().optional(),
});

const CategoryDialog = ({ open, onClose, mode = 'create', category }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: '', description: '' },
  });

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && category) {
      reset({ name: category.name, description: category.description });
    } else {
      reset({ name: '', description: '' });
    }
  }, [mode, category, reset]);

  const onSubmit = async (data) => {
    try {
      if (mode === 'create') {
        await categoryService.createCategory(data);
        toast.success('Category created');
      } else {
        await categoryService.updateCategory(category.id, data);
        toast.success('Category updated');
      }
      onClose(true); // inform parent to refresh list
    } catch (err) {
      const msg = err?.response?.data?.message || 'Operation failed';
      toast.error(msg);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? (
          <>
            <Plus size={20} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Add Category
          </>
        ) : (
          <>
            <Pencil size={20} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Edit Category
          </>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Category Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={isSubmitting}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isSubmitting}>
          {mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryDialog;
