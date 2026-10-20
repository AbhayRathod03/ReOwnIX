import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          textAlign: 'center',
        }}
      >
        <Typography 
          variant="h1" 
          color="primary" 
          sx={{ 
            fontWeight: 900, 
            fontSize: { xs: '6rem', md: '10rem' },
            lineHeight: 1
          }}
        >
          404
        </Typography>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mt: 2, mb: 1, color: 'text.primary' }}>
          Page not found
        </Typography>
        
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 'sm' }}>
          Sorry, we couldn't find the page you're looking for. It might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Button 
          component={Link} 
          to="/" 
          variant="contained" 
          disableElevation
          sx={{ 
            borderRadius: 2, 
            py: 1.5, 
            px: 4,
            fontWeight: 600,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;