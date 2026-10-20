import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box, Card, CardContent, Typography, TextField, Select,
  MenuItem, FormControl, InputLabel, Button, Grid, Switch,
  FormControlLabel, FormHelperText, CircularProgress,
  Paper, IconButton, LinearProgress, Stack
} from "@mui/material";
import { PhotoCamera, Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import productApi from "../services/productApi";
import categoryApi from "../services/categoryApi";
import auctionApi from "../services/auctionApi";
import ConfirmDialog from "../components/ConfirmDialog";

const schema = yup.object().shape({
  title: yup.string().trim().required("Title is required").min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  description: yup.string().max(1000, "Description cannot exceed 1000 characters"),
  price: yup.number().typeError("Price must be a number").required("Price is required").min(0.01, "Price must be at least 0.01").max(10000000, "Price cannot exceed 10,000,000"),
  quantity: yup.number().typeError("Quantity must be a number").integer("Quantity must be a whole number").min(1, "Quantity must be at least 1").max(999, "Quantity cannot exceed 999").default(1),
  brand: yup.string().max(50, "Brand cannot exceed 50 characters"),
  productCondition: yup.string().required("Condition is required"),
  listingType: yup.string().required("Listing type is required"),
  categoryId: yup.number().typeError("Category is required").required("Category is required"),
  isAuction: yup.boolean(),
  startingPrice: yup.number().when("isAuction", {
    is: true,
    then: () => yup.number().typeError("Starting price must be a number").required("Starting price is required").moreThan(0, "Starting price must be greater than 0").max(10000000, "Cannot exceed 10,000,000"),
    otherwise: () => yup.number().nullable().transform((v, o) => String(o).trim() === '' ? null : v),
  }),
  minBidIncrement: yup.number().when("isAuction", {
    is: true,
    then: () => yup.number().typeError("Bid increment must be a number").required("Bid increment is required").min(1, "Increment must be at least 1"),
    otherwise: () => yup.number().nullable().transform((v, o) => String(o).trim() === '' ? null : v),
  }),
  startDate: yup.date().when("isAuction", {
    is: true,
    then: () => yup.date().typeError("Valid start date is required").required("Start date is required").test("is-future", "Start date must be at least 5 minutes in the future", function (value) {
      if (!value) return false;
      const fiveMinsFromNow = new Date(Date.now() + 4 * 60 * 1000);
      return value > fiveMinsFromNow;
    }),
    otherwise: () => yup.date().nullable().transform((v, o) => String(o).trim() === '' ? null : v),
  }),
  endDate: yup.date().when("isAuction", {
    is: true,
    then: () => yup.date().typeError("Valid end date is required").required("End date is required").test("is-after-start", "End date must be at least 1 hour after start date", function (value) {
      const { startDate } = this.parent;
      if (!value || !startDate) return false;
      const oneHourAfterStart = new Date(startDate.getTime() + 60 * 60 * 1000);
      return value >= oneHourAfterStart;
    }),
    otherwise: () => yup.date().nullable().transform((v, o) => String(o).trim() === '' ? null : v),
  }),
});

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const CreateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [productLoading, setProductLoading] = useState(isEditing);

  // Image states
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadingStage, setUploadingStage] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      quantity: "1",
      brand: "",
      productCondition: "NEW",
      listingType: "FIXED_PRICE",
      categoryId: "",
      isAuction: false,
      startingPrice: "",
      minBidIncrement: "",
      startDate: "",
      endDate: "",
    },
  });

  const isAuction = watch("isAuction");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data ?? response);
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const fetchProductAndImages = async () => {
        try {
          const [product, images] = await Promise.all([
            productApi.getProduct(id),
            productApi.getImages(id).catch(() => [])
          ]);
          
          setExistingImages(images || []);
          
          reset({
            title: product.title || "",
            description: product.description || "",
            price: product.price || "",
            quantity: product.quantity || "1",
            brand: product.brand || "",
            productCondition: product.condition || "NEW",
            listingType: product.listingType || "FIXED_PRICE",
            categoryId: product.categoryId || "",
            isAuction: product.listingType === "AUCTION",
            startingPrice: "",
            minBidIncrement: "",
            startDate: "",
            endDate: "",
          });
        } catch (err) {
          toast.error("Failed to load product for editing");
        } finally {
          setProductLoading(false);
        }
      };
      fetchProductAndImages();
    }
  }, [id, isEditing, reset]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [newFiles]);

  const validateFiles = (files) => {
    const validFiles = [];
    const totalImages = existingImages.length + newFiles.length;
    
    if (totalImages + files.length > MAX_IMAGES) {
      toast.error(`You can only upload up to ${MAX_IMAGES} images.`);
      return [];
    }

    Array.from(files).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported format (JPG/PNG/WEBP)`);
      } else if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 5MB size limit`);
      } else {
        file.preview = URL.createObjectURL(file);
        validFiles.push(file);
      }
    });
    return validFiles;
  };

  const handleFileSelect = (e) => {
    const valid = validateFiles(e.target.files);
    setNewFiles(prev => [...prev, ...valid]);
    e.target.value = null; // Reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const valid = validateFiles(e.dataTransfer.files);
      setNewFiles(prev => [...prev, ...valid]);
    }
  };

  const removeNewFile = (index) => {
    setNewFiles(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const confirmDeleteExisting = async () => {
    if (!deletingId) return;
    try {
      await productApi.deleteImage(deletingId);
      toast.success("Image removed");
      setExistingImages(prev => prev.filter(img => img.id !== deletingId));
    } catch (err) {
      toast.error("Failed to remove image");
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  const onSubmit = async (data) => {
    if (existingImages.length === 0 && newFiles.length === 0) {
      toast.error("Please add at least 1 product image");
      return;
    }

    setUploadingStage(true);
    let currentProductId = id;

    try {
      const payload = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
        brand: data.brand,
        condition: data.productCondition,
        listingType: data.listingType,
        categoryId: Number(data.categoryId),
      };

      if (!isEditing) {
        const created = await productApi.createProduct(payload);
        currentProductId = created?.id ?? created?.productId;
        
        if (data.isAuction || data.listingType === "AUCTION") {
          await auctionApi.create({
            productId: currentProductId,
            startingPrice: Number(data.startingPrice),
            minimumBidIncrement: Number(data.minBidIncrement),
            startTime: data.startDate,
            endTime: data.endDate,
          });
        }
        
        // Update URL instantly so if uploads fail, next click performs an Update
        window.history.replaceState(null, '', `/products/edit/${currentProductId}`);
      } else {
        await productApi.updateProduct(currentProductId, payload);
      }

      // Upload Images Sequential Orchestration
      let hasUploadErrors = false;
      for (let i = 0; i < newFiles.length; i++) {
        const file = newFiles[i];
        const formData = new FormData();
        formData.append('file', file);
        try {
          await productApi.uploadImages(currentProductId, formData, (evt) => {
            setUploadProgress(prev => ({ ...prev, [file.name]: Math.round((evt.loaded * 100) / evt.total) }));
          });
        } catch (err) {
          hasUploadErrors = true;
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (hasUploadErrors) {
        toast.error("Product saved, but some images failed to upload. Please retry.");
        // Keep them on the page to retry remaining failed images if needed.
        // We'll remove successfully uploaded images from newFiles by refetching.
        const updatedImages = await productApi.getImages(currentProductId).catch(() => []);
        setExistingImages(updatedImages);
        setNewFiles([]); // Simplified logic: just clear all, forcing them to reselect failed ones.
      } else {
        toast.success(isEditing ? "Product updated successfully!" : "Listing created successfully!");
        navigate(`/products/${currentProductId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save product details");
    } finally {
      setUploadingStage(false);
      setUploadProgress({});
    }
  };

  if (productLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", py: 6, px: { xs: 2, md: 4 } }}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="900" sx={{ mb: 4 }}>
          {isEditing ? "Edit Product" : "Sell an Item"}
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Product Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" error={!!errors.title} helperText={errors.title?.message} {...register("title")} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="Description" error={!!errors.description} helperText={errors.description?.message} {...register("description")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Price (₹)" error={!!errors.price} helperText={errors.price?.message} {...register("price")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="number" label="Quantity" error={!!errors.quantity} helperText={errors.quantity?.message} {...register("quantity")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Brand" error={!!errors.brand} helperText={errors.brand?.message} {...register("brand")} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="condition-label">Condition</InputLabel>
                  <Controller
                    name="productCondition"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="condition-label" label="Condition">
                        <MenuItem value="NEW">New</MenuItem>
                        <MenuItem value="LIKE_NEW">Like New</MenuItem>
                        <MenuItem value="GOOD">Good</MenuItem>
                        <MenuItem value="FAIR">Fair</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.categoryId}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} labelId="category-label" label="Category" disabled={loadingCategories}>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.categoryId && <FormHelperText>{errors.categoryId?.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="listing-type-label">Listing Type</InputLabel>
                  <Controller
                    name="listingType"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="listing-type-label"
                        label="Listing Type"
                        onChange={(e) => {
                          field.onChange(e);
                          setValue("isAuction", e.target.value === "AUCTION");
                        }}
                      >
                        <MenuItem value="FIXED_PRICE">Fixed Price</MenuItem>
                        <MenuItem value="AUCTION">Auction</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {isAuction && (
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, border: '1px solid', borderColor: 'divider', bgcolor: 'warning.50' }} elevation={0}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: 'warning.900' }}>
                Auction Details
              </Typography>
              <Typography variant="body2" color="warning.700" sx={{ mb: 3 }}>
                Configure your starting bid and auction timeline.
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Starting Price (₹)" error={!!errors.startingPrice} helperText={errors.startingPrice?.message} {...register("startingPrice")} sx={{ bgcolor: 'white' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="number" label="Minimum Bid Increment (₹)" error={!!errors.minBidIncrement} helperText={errors.minBidIncrement?.message} {...register("minBidIncrement")} sx={{ bgcolor: 'white' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="datetime-local" label="Start Time" slotProps={{ inputLabel: { shrink: true } }} error={!!errors.startDate} helperText={errors.startDate?.message} {...register("startDate")} sx={{ bgcolor: 'white' }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth type="datetime-local" label="End Time" slotProps={{ inputLabel: { shrink: true } }} error={!!errors.endDate} helperText={errors.endDate?.message} {...register("endDate")} sx={{ bgcolor: 'white' }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Unified Image Upload Section */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mb: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">Product Images</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add up to 10 images. First image will be the cover.
                </Typography>
              </Box>
              <Typography variant="caption" fontWeight="bold" color={(existingImages.length + newFiles.length) === 0 ? "error.main" : "primary.main"}>
                {existingImages.length + newFiles.length} / 10
              </Typography>
            </Box>

            <Paper
              elevation={0}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'grey.50',
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' }
              }}
            >
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={handleFileSelect}
              />
              <label htmlFor="image-upload" style={{ width: '100%', height: '100%', cursor: 'pointer', display: 'block' }}>
                <PhotoCamera sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Drag & Drop images here
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  or click to browse files (JPG, PNG, WEBP - Max 5MB)
                </Typography>
              </label>
            </Paper>

            {/* Previews */}
            {(existingImages.length > 0 || newFiles.length > 0) && (
              <Grid container spacing={2} sx={{ mt: 3 }}>
                {existingImages.map((img) => (
                  <Grid item xs={6} sm={4} md={3} key={img.id}>
                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', aspectRatio: '1/1' }}>
                      <Box component="img" src={img.url} alt="Product" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <IconButton
                        size="small"
                        onClick={() => { setDeletingId(img.id); setConfirmOpen(true); }}
                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
                
                {newFiles.map((file, idx) => (
                  <Grid item xs={6} sm={4} md={3} key={idx}>
                    <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider', aspectRatio: '1/1' }}>
                      <Box component="img" src={file.preview} alt={file.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      
                      {!uploadingStage && (
                        <IconButton
                          size="small"
                          onClick={() => removeNewFile(idx)}
                          sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'error.main', color: 'white' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}

                      {uploadingStage && uploadProgress[file.name] != null && (
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, bgcolor: 'rgba(0,0,0,0.6)', p: 1 }}>
                          <LinearProgress variant="determinate" value={uploadProgress[file.name]} color="success" />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Submit Actions */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={uploadingStage} sx={{ borderRadius: 2, px: 4 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={uploadingStage || (existingImages.length === 0 && newFiles.length === 0)}
            startIcon={uploadingStage ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 2, px: 6, py: 1.5, fontWeight: 'bold' }}
          >
            {uploadingStage ? "Saving & Uploading..." : (isEditing ? "Save Changes" : "Create Listing")}
          </Button>
        </Box>
      </form>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={confirmOpen}
        title="Remove Image"
        description="Are you sure you want to remove this image? This happens instantly and cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDeleteExisting}
      />
    </Box>
  );
};

export default CreateProduct;