// src/components/review/ReviewForm.jsx
import React, { useState } from 'react';
import { Box, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RatingStars from './RatingStars';
import reviewApi from '../../services/reviewApi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Validation schema: rating required (1-5), comment required (max 500 chars)
const schema = yup.object().shape({
  rating: yup.number().required('Rating is required').min(1).max(5),
  comment: yup.string().required('Comment is required').max(500, 'Maximum 500 characters'),
});

/**
 * ReviewForm allows an authenticated user to submit a review for a product.
 * Props:
 *   - productId: id of the product being reviewed
 *   - onSuccess: optional callback after a successful submission (e.g., refresh list)
 */
const ReviewForm = ({ productId, sellerId, onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [toastAlert, setToastAlert] = useState({ open: false, severity: 'success', message: '' });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { rating: 0, comment: '' },
  });

  const onSubmit = async (data) => {
    if (!user) {
      setToastAlert({ open: true, severity: 'error', message: 'Please login to submit a review.' });
      setTimeout(() => {
        navigate('/login', { state: { from: location } });
      }, 1500);
      return;
    }
    setLoading(true);
    try {
      const payload = { ...data, sellerId, productId };
      await reviewApi.create(payload);
      setToastAlert({ open: true, severity: 'success', message: 'Review submitted!' });
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setToastAlert({ open: true, severity: 'error', message: err.response?.data?.message || 'Failed to submit review' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseToast = () => setToastAlert((t) => ({ ...t, open: false }));

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 2, mb: 4, borderRadius: 2, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <RatingStars
            value={field.value}
            onChange={field.onChange}
            readOnly={false}
          />
        )}
      />
      {errors.rating && (
        <Box sx={{ color: 'error.main', mt: 0.5 }}>{errors.rating.message}</Box>
      )}

      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Comment"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors.comment}
            helperText={errors.comment?.message}
          />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Button type="submit" variant="contained" disabled={loading} sx={{ mr: 2 }}>
          Submit Review
        </Button>
        {loading && <CircularProgress size={24} />}
      </Box>

      <Snackbar open={toastAlert.open} autoHideDuration={4000} onClose={handleCloseToast}>
        <Alert severity={toastAlert.severity} onClose={handleCloseToast} sx={{ width: '100%' }}>
          {toastAlert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewForm;
