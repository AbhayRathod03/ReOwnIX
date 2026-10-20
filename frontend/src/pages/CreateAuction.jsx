// src/pages/CreateAuction.jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import auctionApi from '../services/auctionApi';
import { formatISO } from 'date-fns';

// Validation schema using Yup
const schema = yup.object().shape({
  productId: yup.string().required('Product ID is required'),
  startingPrice: yup
    .number()
    .typeError('Starting price must be a number')
    .positive('Starting price must be greater than 0')
    .required('Starting price is required'),
  minimumBidIncrement: yup
    .number()
    .typeError('Minimum increment must be a number')
    .positive('Minimum increment must be greater than 0')
    .required('Minimum increment is required'),
  startTime: yup
    .date()
    .typeError('Start date is required')
    .required('Start date is required'),
  endTime: yup
    .date()
    .typeError('End date is required')
    .min(yup.ref('startTime'), 'End date must be after start date')
    .required('End date is required'),
});

const CreateAuction = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      productId: '',
      startingPrice: '',
      minimumBidIncrement: '',
      startTime: '',
      endTime: '',
    },
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError(null);
    setSuccess(false);
    try {
      // Convert dates to ISO string for backend compatibility
      const payload = {
        productId: data.productId,
        startingPrice: Number(data.startingPrice),
        minimumBidIncrement: Number(data.minimumBidIncrement),
        startTime: formatISO(new Date(data.startTime)),
        endTime: formatISO(new Date(data.endTime)),
      };
      await auctionApi.create(payload);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error('Create auction failed', err);
      setApiError(err?.response?.data?.message || 'Failed to create auction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h5" gutterBottom>
          Create New Auction
        </Typography>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Auction created successfully!
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="productId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Product ID"
                fullWidth
                margin="normal"
                error={!!errors.productId}
                helperText={errors.productId?.message}
              />
            )}
          />
          <Controller
            name="startingPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Starting Price"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.startingPrice}
                helperText={errors.startingPrice?.message}
              />
            )}
          />
          <Controller
            name="minimumBidIncrement"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Minimum Increment"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.minimumBidIncrement}
                helperText={errors.minimumBidIncrement?.message}
              />
            )}
          />
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Start Date & Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                error={!!errors.startTime}
                helperText={errors.startTime?.message}
              />
            )}
          />
          <Controller
            name="endTime"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="End Date & Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
                error={!!errors.endTime}
                helperText={errors.endTime?.message}
              />
            )}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Create Auction
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateAuction;
