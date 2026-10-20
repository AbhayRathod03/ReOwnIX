import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, Watch, Smartphone, Shirt, Gamepad2, Sofa, BookOpen, Car, Diamond, Home, Trophy, Monitor, Camera } from 'lucide-react';
import { useColorMode } from '../../context/ThemeContext';

const categories = [
  { id: 'all', label: 'All', icon: <Diamond size={24} /> },
  { id: 'watches', label: 'Watches', icon: <Watch size={24} /> },
  { id: 'electronics', label: 'Electronics', icon: <Smartphone size={24} /> },
  { id: 'fashion', label: 'Fashion', icon: <Shirt size={24} /> },
  { id: 'gaming', label: 'Gaming', icon: <Gamepad2 size={24} /> },
  { id: 'furniture', label: 'Furniture', icon: <Sofa size={24} /> },
  { id: 'books', label: 'Books', icon: <BookOpen size={24} /> },
  { id: 'vehicles', label: 'Vehicles', icon: <Car size={24} /> },
  { id: 'luxury', label: 'Luxury', icon: <Diamond size={24} /> },
  { id: 'home', label: 'Home', icon: <Home size={24} /> },
  { id: 'sports', label: 'Sports', icon: <Trophy size={24} /> },
  { id: 'monitors', label: 'Monitors', icon: <Monitor size={24} /> },
  { id: 'cameras', label: 'Cameras', icon: <Camera size={24} /> },
];

const CategoryBar = () => {
  const scrollRef = useRef(null);
  const [selected, setSelected] = useState('all');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const { mode } = useColorMode();

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, []);

  const scrollBy = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'sticky', 
        top: 64, // below navbar
        zIndex: (theme) => theme.zIndex.appBar - 1, 
        bgcolor: mode === 'light' ? 'background.paper' : '#0F172A',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 4 },
        py: 1.5,
        boxShadow: mode === 'light' ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 4px 6px -1px rgba(0,0,0,0.5)',
      }}
    >
      {showLeftArrow && (
        <IconButton 
          onClick={() => scrollBy(-300)} 
          size="small"
          sx={{ 
            position: 'absolute', left: 16, zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronLeft size={20} />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{
          display: 'flex',
          gap: 4,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome
          mx: { xs: 0, md: 4 }
        }}
      >
        {categories.map((cat) => (
          <Box
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              opacity: selected === cat.id ? 1 : 0.6,
              borderBottom: '2px solid',
              borderColor: selected === cat.id ? 'text.primary' : 'transparent',
              pb: 1,
              minWidth: 'max-content',
              transition: 'all 0.2s',
              '&:hover': {
                opacity: 1,
                borderColor: selected !== cat.id ? 'divider' : 'text.primary',
              }
            }}
          >
            {cat.icon}
            <Typography variant="caption" sx={{ fontWeight: selected === cat.id ? 700 : 500 }}>
              {cat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {showRightArrow && (
        <IconButton 
          onClick={() => scrollBy(300)} 
          size="small"
          sx={{ 
            position: 'absolute', right: 16, zIndex: 2, 
            bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
            '&:hover': { bgcolor: 'background.default' }
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default CategoryBar;
