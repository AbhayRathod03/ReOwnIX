import React, { useState } from 'react';
import { Box, IconButton, Dialog, Fade, Typography } from '@mui/material';
import { Maximize2, Share2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductGallery = ({ images = [], fallbackImage }) => {
  const defaultImage = fallbackImage || '/default-product.png';
  const displayImages = images.length > 0 ? images.map(img => img.url || img) : [defaultImage];
  
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Main Image Container */}
      <Box 
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: { xs: 350, md: 500, lg: 600 }, 
          bgcolor: '#f8fafc',
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          mb: 2,
          '&:hover .overlay-actions': { opacity: 1 },
          '&:hover .zoom-img': { transform: 'scale(1.05)' } // Zoom on hover
        }}
      >
        <Box
          component="img"
          className="zoom-img"
          src={displayImages[selectedIdx]}
          alt="Product"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transition: 'transform 0.4s ease-in-out',
            cursor: 'zoom-in'
          }}
          onClick={() => setFullscreenOpen(true)}
        />
        
        {/* Overlay Actions */}
        <Box 
          className="overlay-actions"
          sx={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            display: 'flex', 
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out'
          }}
        >
          <IconButton 
            onClick={handleShare}
            sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'white' } }}
          >
            <Share2 size={20} />
          </IconButton>
          <IconButton 
            onClick={() => setFullscreenOpen(true)}
            sx={{ bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', '&:hover': { bgcolor: 'white' } }}
          >
            <Maximize2 size={20} />
          </IconButton>
        </Box>

        {/* Image Counter */}
        {displayImages.length > 1 && (
          <Box sx={{ position: 'absolute', bottom: 16, right: 16, bgcolor: 'rgba(0,0,0,0.6)', color: 'white', px: 1.5, py: 0.5, borderRadius: '12px', backdropFilter: 'blur(4px)' }}>
            <Typography variant="caption" fontWeight="bold">
              {selectedIdx + 1} / {displayImages.length}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'grey.300', borderRadius: 4 } }}>
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
                border: '2px solid',
                borderColor: selectedIdx === idx ? 'primary.main' : 'transparent',
                opacity: selectedIdx === idx ? 1 : 0.6,
                transition: 'all 0.2s',
                '&:hover': { opacity: 1 },
                flexShrink: 0,
                bgcolor: 'grey.100'
              }}
            >
              <Box component="img" src={img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
          ))}
        </Box>
      )}

      {/* Fullscreen Dialog */}
      <Dialog 
        fullScreen 
        open={fullscreenOpen} 
        onClose={() => setFullscreenOpen(false)}
        TransitionComponent={Fade}
        PaperProps={{ sx: { bgcolor: 'rgba(0,0,0,0.95)' } }}
      >
        <IconButton 
          onClick={() => setFullscreenOpen(false)} 
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
        >
          <X size={32} />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', p: 2 }}>
          <Box component="img" src={displayImages[selectedIdx]} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </Box>
      </Dialog>
    </Box>
  );
};

export default ProductGallery;
