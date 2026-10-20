import React, { useState, useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import { ArrowUp, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useColorMode } from '../context/ThemeContext';

import HeroSlider from '../components/home/HeroSlider';
import FeaturedAuctions from '../components/home/FeaturedAuctions';
import RecentlyAdded from '../components/home/RecentlyAdded';
import CategoryShowcase from '../components/home/CategoryShowcase';
import PremiumMembershipBanner from '../components/home/PremiumMembershipBanner';
import WhyReOwnX from '../components/home/WhyReOwnX';
import StatisticsCounters from '../components/home/StatisticsCounters';
import TestimonialCarousel from '../components/home/TestimonialCarousel';

const Home = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { mode } = useColorMode();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ bgcolor: mode === 'light' ? '#fff' : 'background.default', transition: 'background-color 0.3s' }}>

      <HeroSlider />

      
      {/* Sections Wrapper for Framer Motion Page Transition */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FeaturedAuctions />

        <RecentlyAdded />
        <CategoryShowcase />
        <PremiumMembershipBanner />
        <WhyReOwnX />
        <StatisticsCounters />
        <TestimonialCarousel />
      </motion.div>

      {/* Floating Action Buttons */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <Fab 
              component={Link}
              to="/auctions"
              variant="extended" 
              sx={{ 
                bgcolor: 'primary.main', color: 'white', 
                boxShadow: '0 8px 24px rgba(255, 56, 92, 0.4)',
                fontWeight: 700, px: 3,
                animation: 'pulse 2s infinite',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <Gavel size={20} style={{ marginRight: 8 }} />
              Live Auctions
            </Fab>

            <Fab 
              onClick={scrollToTop}
              size="medium" 
              sx={{ 
                alignSelf: 'flex-end',
                bgcolor: mode === 'light' ? 'white' : 'background.paper', 
                color: 'text.primary',
                boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: mode === 'light' ? 'grey.50' : 'background.default' }
              }}
            >
              <ArrowUp size={24} />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Home;
