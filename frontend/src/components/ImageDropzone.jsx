import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  LinearProgress,
  Alert,
  Typography,
} from '@mui/material';
import { Upload, Trash2, AlertCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILES = 5;
const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const ImageDropzone = ({
  selectedFiles = [],
  setSelectedFiles,
  errors = [],
  setErrors,
  uploadProgress,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const newFiles = [];
      const newErrors = [];

      const totalCount = selectedFiles.length + acceptedFiles.length;
      if (totalCount > MAX_FILES) {
        newErrors.push(
          `Maximum ${MAX_FILES} images allowed. You selected ${totalCount} images.`
        );
      }

      acceptedFiles.forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
          newErrors.push(`${file.name}: Unsupported file type.`);
          return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          newErrors.push(`${file.name}: Exceeds size limit of ${MAX_SIZE_MB} MB.`);
          return;
        }

        const preview = URL.createObjectURL(file);
        newFiles.push({ file, preview, id: uuidv4() });
      });

      if (newErrors.length) {
        setErrors(newErrors);
      } else {
        setErrors([]);
      }

      if (newFiles.length) {
        setSelectedFiles((prev) => [...prev, ...newFiles]);
      }
    },
    [selectedFiles, setSelectedFiles, setErrors]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: true,
    maxSize: MAX_SIZE_MB * 1024 * 1024,
  });

  const removeFile = (id, preview) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <Box>
      {errors && errors.length > 0 && (
        <Alert severity="error" icon={<AlertCircle size={20} />} sx={{ mb: 2 }}>
          {errors.map((e, i) => (
            <Typography variant="body2" key={i}>
              {e}
            </Typography>
          ))}
        </Alert>
      )}

      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #c4c4c4',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'rgba(0,0,0,0.04)' : 'transparent',
          transition: 'background-color 0.2s, border-color 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ display: 'flex', justifyContent: 'center', color: '#757575' }}>
          <Upload size={40} />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: '#757575' }}>
          Drag &amp; drop images here, or click to select (max {MAX_FILES} images)
        </Typography>
      </Box>

      {/* Preview Grid */}
      {selectedFiles && selectedFiles.length > 0 && (
        <ImageList
          cols={Math.min(selectedFiles.length, 5)}
          gap={12}
          sx={{ mt: 2, mb: 0 }}
        >
          {selectedFiles.map(({ id, preview, file }) => (
            <ImageListItem
              key={id}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <img
                src={preview}
                alt={file.name}
                style={{
                  width: '100%',
                  height: 140,
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <ImageListItemBar
                position="top"
                sx={{
                  background:
                    'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
                }}
                actionIcon={
                  <IconButton
                    sx={{ color: 'white' }}
                    onClick={() => removeFile(id, preview)}
                    aria-label={`remove ${file.name}`}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                }
              />
              {uploadProgress && uploadProgress[id] != null && (
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress[id]}
                  sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default ImageDropzone;