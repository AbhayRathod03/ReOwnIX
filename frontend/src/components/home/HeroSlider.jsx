import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Own Premium. Spend Smart.',
    subtitle: 'Discover verified luxury watches at unbeatable prices.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
    category: 'Luxury Watches',
  },
  {
    id: 2,
    title: 'Level Up Your Game.',
    subtitle: 'Pre-owned consoles and accessories in pristine condition.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop',
    category: 'Gaming',
  },
  {
    id: 3,
    title: 'Tech That Empowers.',
    subtitle: 'Premium second-hand electronics tested for quality.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop',
    category: 'Electronics',
  },
  {
    id: 4,
    title: 'Step Into Style.',
    subtitle: 'Exclusive sneakers authenticated by experts.',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop',
    category: 'Sneakers',
  },
  {
    id: 5,
    title: 'Timeless Fashion.',
    subtitle: 'Designer pieces to elevate your wardrobe.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    category: 'Fashion',
  },
  {
    id: 6,
    title: 'Rare Finds.',
    subtitle: 'Unique collectibles for the passionate enthusiast.',
    image: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop',
    category: 'Collectibles',
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const slideVariants = {
    hidden: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
    })
  };

  const currentSlide = slides[currentIndex];

  return (
    <Box sx={{ position: 'relative', width: '100%', height: { xs: '60vh', md: '75vh' }, overflow: 'hidden', bgcolor: '#000' }}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          {/* Background Image */}
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          {/* Dark Gradient Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* Content Container */}
            <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', px: { xs: 3, md: 6 } }}>
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2, mb: 1, display: 'block' }}>
                  {currentSlide.category}
                </Typography>
                <Typography variant="h1" sx={{ color: '#fff', maxWidth: { xs: '100%', md: '60%' }, mb: 2, fontSize: { xs: '2.5rem', md: '4.5rem' }, lineHeight: 1.1 }}>
                  {currentSlide.title}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', maxWidth: { xs: '100%', md: '50%' }, mb: 4, fontWeight: 400 }}>
                  {currentSlide.subtitle}
                </Typography>
                <Button 
                  component={Link} 
                  to="/products"
                  variant="contained" 
                  color="primary"
                  size="large"
                  sx={{ py: 1.5, px: 4, fontSize: '1.1rem', borderRadius: 8 }}
                >
                  Browse Marketplace
                </Button>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <IconButton 
        onClick={prevSlide}
        sx={{ 
          position: 'absolute', top: '50%', left: { xs: 10, md: 30 }, transform: 'translateY(-50%)', 
          bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
        }}
      >
        <ChevronLeft size={32} />
      </IconButton>
      <IconButton 
        onClick={nextSlide}
        sx={{ 
          position: 'absolute', top: '50%', right: { xs: 10, md: 30 }, transform: 'translateY(-50%)', 
          bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
        }}
      >
        <ChevronRight size={32} />
      </IconButton>

      {/* Pagination Dots */}
      <Box sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1.5 }}>
        {slides.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => goToSlide(idx)}
            sx={{
              width: currentIndex === idx ? 24 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor: currentIndex === idx ? 'primary.main' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default HeroSlider;
