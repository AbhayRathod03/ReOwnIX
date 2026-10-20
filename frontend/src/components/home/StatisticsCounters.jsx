import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useColorMode } from '../../context/ThemeContext';

const AnimatedCounter = ({ from = 0, to, duration = 2, suffix = '' }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString('en-IN') + suffix);

  React.useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [count, to, duration]);

  return <motion.span>{rounded}</motion.span>;
};

const stats = [
  { value: 25000, suffix: '+', label: 'Products Listed' },
  { value: 10000, suffix: '+', label: 'Happy Users' },
  { value: 500, suffix: '+', label: 'Live Auctions' },
  { value: 20, suffix: ' Cr+', label: 'Transactions' },
];

const StatisticsCounters = () => {
  const { mode } = useColorMode();

  return (
    <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background elements */}
      <Box sx={{ position: 'absolute', top: -100, left: -100, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
      <Box sx={{ position: 'absolute', bottom: -150, right: -50, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 }, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, idx) => (
            <Grid item xs={6} md={3} key={idx} sx={{ textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
              >
                <Typography variant="h3" fontWeight="900" sx={{ mb: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </Typography>
                <Typography variant="subtitle1" fontWeight="600" sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsCounters;
