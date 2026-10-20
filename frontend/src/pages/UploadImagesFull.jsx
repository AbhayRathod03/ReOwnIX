// src/pages/UploadImagesFull.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Grid, Paper, LinearProgress, CircularProgress } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import toast from 'react-hot-toast';
import productApi from '../services/productApi';
import ConfirmDialog from '../components/ConfirmDialog';

const UploadImages = () => {
  const { id } = useParams(); // product id
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]); // {id, url}
  const [newFiles, setNewFiles] = useState([]); // File objects with preview
  const [uploadProgress, setUploadProgress] = useState({}); // name -> percent
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch already uploaded images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await productApi.getImages(id);
      setExistingImages(data ?? []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
    return () => {
      newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files).map((file) => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
    setNewFiles((prev) => [...prev, ...selected]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const dropped = Array.from(e.dataTransfer.files).map((file) => {
        file.preview = URL.createObjectURL(file);
        return file;
      });
      setNewFiles((prev) => [...prev, ...dropped]);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles((prev) => {
      const file = prev[index];
      URL.revokeObjectURL(file.preview);
      return prev.filter((_, i) => i !== index);
    });
    setUploadProgress((prev) => {
      const newProg = { ...prev };
      delete newProg[prev[index]?.name];
      return newProg;
    });
  };

  const handleDeleteExisting = (imageId) => {
    setDeletingId(imageId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await productApi.deleteImage(deletingId);
      toast.success('Image deleted');
      fetchImages();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete image');
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const uploadAll = async () => {
    if (newFiles.length === 0) return;
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const formData = new FormData();
      formData.append('images', file);
      try {
        await productApi.uploadImages(id, formData, (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress((prev) => ({ ...prev, [file.name]: percent }));
        });
      } catch (err) {
        console.error(err);
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    toast.success('All images uploaded');
    setNewFiles([]);
    setUploadProgress({});
    fetchImages();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Upload Images for Product #{id}
      </Typography>

      {/* Drag & Drop Zone */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          border: '2px dashed rgba(0,0,0,0.15)',
          bgcolor: 'background.paper',
          backdropFilter: 'blur(6px)',
          borderRadius: 2,
          cursor: 'pointer',
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFileSelect}
        />
        <label htmlFor="image-upload">
          <IconButton color="primary" component="span" aria-label="upload pictures">
            <PhotoCamera fontSize="large" />
          </IconButton>
        </label>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Drag & drop images here or click the camera icon to select files.
        </Typography>
      </Paper>

      {/* New files preview */}
      {newFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Selected files
          </Typography>
          <Grid container spacing={2}>
            {newFiles.map((file, idx) => (
              <Grid xs={6} sm={4} md={3} key={idx}>
                <Box sx={{ position: 'relative', '&:hover img': { transform: 'scale(1.05)', transition: 'transform .2s' } }}>
                  <img
                    src={file.preview}
                    alt={file.name}
                    style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeNewFile(idx)}
                    sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.7)' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {uploadProgress[file.name] != null && (
                    <LinearProgress variant="determinate" value={uploadProgress[file.name]} sx={{ mt: 0.5 }} />
                  )}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Existing images */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        existingImages.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Existing images
            </Typography>
            <Grid container spacing={2}>
              {existingImages.map((img) => (
                <Grid xs={6} sm={4} md={3} key={img.id}>
                  <Box sx={{ position: 'relative', '&:hover img': { transform: 'scale(1.05)', transition: 'transform .2s' } }}>
                    <img src={img.url} alt="product" style={{ width: '100%', height: 'auto', borderRadius: 8 }} />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteExisting(img.id)}
                      sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.7)' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )
      )}

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/profile/my-products')}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={newFiles.length === 0}
          onClick={uploadAll}
        >
          Upload Images
        </Button>
      </Box>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Image"
        description="Are you sure you want to delete this image? This cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
};

export default UploadImages;
