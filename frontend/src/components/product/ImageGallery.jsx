import React, { useState } from 'react';
import { Box, CardMedia } from '@mui/material';

const ImageGallery = ({ images, fallbackImage }) => {
  const defaultImage = fallbackImage || '/default-product.png';
  const displayImages = images && images.length > 0 ? images : [{ url: defaultImage }];
  
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <Box>
      <Box sx={{ mb: 2, borderRadius: 3, overflow: 'hidden', boxShadow: 1 }}>
        <CardMedia
          component="img"
          image={displayImages[selectedIdx]?.url || defaultImage}
          alt="Product Image"
          sx={{ width: '100%', height: { xs: 300, md: 500 }, objectFit: 'contain', bgcolor: '#f9fafb' }}
        />
      </Box>
      
      {displayImages.length > 1 && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1 }}>
          {displayImages.map((img, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                border: selectedIdx === idx ? '2px solid' : '2px solid transparent',
                borderColor: selectedIdx === idx ? 'primary.main' : 'transparent',
                opacity: selectedIdx === idx ? 1 : 0.6,
                transition: 'all 0.2s',
                '&:hover': { opacity: 1 },
                flexShrink: 0
              }}
            >
              <CardMedia
                component="img"
                image={img.url}
                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageGallery;
