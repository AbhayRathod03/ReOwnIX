import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from '@mui/material';
import offerApi from '../../services/offerApi';
import chatService from '../../services/chatService';
import webSocketService from '../../services/websocket';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MakeOfferDialog = ({ open, onClose, product }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerAmount = Number(amount);
    if (!offerAmount || offerAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (offerAmount > 10000000) {
      toast.error('Offer cannot exceed ₹10,000,000');
      return;
    }

    try {
      setLoading(true);
      const newOffer = await offerApi.makeOffer({ productId: product.id, amount: offerAmount });
      
      // Auto-start or fetch conversation
      const conv = await chatService.startConversation(product.id);
      
      // Send WebSocket payload so it appears immediately as an Offer Card
      webSocketService.sendChatMessage(conv.conversationId, JSON.stringify({
        type: 'OFFER',
        amount: offerAmount,
        status: 'PENDING',
        offerId: newOffer?.id
      }));

      toast.success('Offer submitted successfully');
      onClose();
      setAmount('');
      
      // Navigate to chat
      navigate(`/chat/${conv.conversationId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Make an Offer</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You are making an offer on: <strong>{product?.title}</strong>
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Offer Amount (₹)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 1, step: "0.01" }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || !amount}>
            {loading ? 'Submitting...' : 'Submit Offer'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default MakeOfferDialog;
