import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, Avatar } from '@mui/material';
import { Check, X, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OfferCard = ({ offer, isSeller, onStatusUpdate }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'ACCEPTED': return 'success';
      case 'REJECTED': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2, borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid', borderColor: 'divider', position: 'relative' }}>
      
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Chip label={offer.status} color={getStatusColor(offer.status)} size="small" sx={{ fontWeight: 'bold' }} />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={offer.productThumbnail} alt={offer.productTitle} variant="rounded" sx={{ width: 64, height: 64, mr: 2 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ maxWidth: 180 }}>
            {offer.productTitle || 'Unknown Product'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isSeller ? `From: ${offer.buyerName || 'Buyer'}` : `To: ${offer.sellerName || 'Seller'}`}
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 2, mb: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          Offer Amount
        </Typography>
        <Typography variant="h4" color="primary.main" fontWeight="900">
          ₹{offer.amount?.toLocaleString('en-IN') || 0}
        </Typography>
      </Box>
      
      <Box sx={{ flexGrow: 1 }} />

      {isSeller && offer.status === 'PENDING' ? (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            fullWidth
            variant="contained" 
            color="success" 
            startIcon={<Check size={16} />}
            onClick={() => onStatusUpdate(offer, 'ACCEPTED')}
            sx={{ borderRadius: 2 }}
          >
            Accept
          </Button>
          <Button 
            fullWidth
            variant="outlined" 
            color="error" 
            startIcon={<X size={16} />}
            onClick={() => onStatusUpdate(offer, 'REJECTED')}
            sx={{ borderRadius: 2 }}
          >
            Reject
          </Button>
        </Box>
      ) : (
        <Button 
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<Tag size={16} />}
          onClick={() => navigate('/chat')} // Usually, we'd navigate to specific chat if we had conv ID
          sx={{ borderRadius: 2 }}
        >
          View in Chat
        </Button>
      )}
    </Card>
  );
};

export default OfferCard;
