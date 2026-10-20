import React, { useRef } from 'react';
import { Box, Typography, Card, CardContent, Avatar, Rating } from '@mui/material';
import { motion } from 'framer-motion';
import { useColorMode } from '../../context/ThemeContext';

const testimonials = [
  { id: 1, name: 'Arjun Mehta', role: 'Watch Enthusiast', avatar: 'https://i.pravatar.cc/150?u=1', rating: 5, text: 'I found a rare Rolex Submariner here. The verification process gave me complete peace of mind. Excellent platform.' },
  { id: 2, name: 'Sarah Jenkins', role: 'Sneaker Collector', avatar: 'https://i.pravatar.cc/150?u=2', rating: 5, text: 'StockX level authentication but with better prices. Sold my Jordans in just 2 days. Highly recommended!' },
  { id: 3, name: 'David Chen', role: 'Gamer', avatar: 'https://i.pravatar.cc/150?u=3', rating: 4.5, text: 'Won an auction for a PS5 at an unbelievable price. The live bidding experience is incredibly smooth.' },
  { id: 4, name: 'Priya Sharma', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=4', rating: 5, text: 'The UI is just gorgeous. It feels like Airbnb for luxury goods. Very safe and reliable community.' },
];

const TestimonialCarousel = () => {
  const { mode } = useColorMode();
  const carouselRef = useRef(null);

  return (
    <Box sx={{ py: 10, px: { xs: 2, md: 4 }, bgcolor: mode === 'light' ? 'white' : 'background.paper', overflow: 'hidden' }}>
      <Typography variant="h3" fontWeight="800" sx={{ mb: 2, textAlign: 'center', letterSpacing: '-0.5px' }}>
        Loved by Collectors
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 8, textAlign: 'center' }}>
        See what our community has to say about ReOwnX.
      </Typography>

      <motion.div
        ref={carouselRef}
        style={{ display: 'flex', gap: '24px', cursor: 'grab' }}
        drag="x"
        dragConstraints={{ right: 0, left: -1000 }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {testimonials.map((t) => (
          <Card
            key={t.id}
            elevation={0}
            sx={{
              minWidth: { xs: 280, md: 350 },
              maxWidth: { xs: 280, md: 350 },
              p: 2,
              borderRadius: 4,
              bgcolor: mode === 'light' ? 'grey.50' : 'background.default',
              border: '1px solid',
              borderColor: 'divider',
              flexShrink: 0
            }}
          >
            <CardContent>
              <Rating value={t.rating} precision={0.5} readOnly sx={{ color: '#FBBF24', mb: 2 }} />
              <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 3, minHeight: 80 }}>
                "{t.text}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={t.avatar} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="700">{t.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{t.role}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </Box>
  );
};

export default TestimonialCarousel;
