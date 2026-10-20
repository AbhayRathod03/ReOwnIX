// src/pages/ChatConversationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Avatar, TextField, IconButton, CircularProgress, Divider, Paper, Button } from '@mui/material';
import { Send, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import chatService from '../services/chatService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ChatConversationPage = () => {
  const { user } = useAuth();
  const { conversationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);

  const fetchData = async () => {
    if (document.hidden) return;
    try {
      // Fetch messages
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs);
      
      // Fetch conversation metadata
      const convs = await chatService.listConversations();
      const currentConv = convs.find(c => String(c.conversationId) === String(conversationId));
      if (currentConv) {
        setConversation(currentConv);
      }
    } catch (err) {
      console.error('Failed to fetch chat data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatService.markRead(conversationId).catch((e) => console.error('Mark read error', e));
    fetchData();
    window.addEventListener('reownx-new-chat-message', fetchData);
    const interval = setInterval(fetchData, 10000); // 10s fallback polling
    return () => {
      clearInterval(interval);
      window.removeEventListener('reownx-new-chat-message', fetchData);
    };
  }, [conversationId]);

  const handleSend = async (content = newMessage.trim()) => {
    if (!content) return;
    try {
      await chatService.sendMessage(conversationId, content);
      setNewMessage('');
      setShowOfferInput(false);
      setOfferAmount('');
      fetchData(); // re-fetch to get exact message ID from backend
    } catch (err) {
      console.error('Send message error', err);
      toast.error('Failed to send message');
    }
  };

  const handleSendOffer = () => {
    if (!offerAmount || isNaN(offerAmount)) return;
    const offerPayload = JSON.stringify({
      type: 'OFFER',
      amount: Number(offerAmount),
      status: 'PENDING'
    });
    handleSend(offerPayload);
  };

  const handleOfferResponse = (msgId, amount, status) => {
    const responsePayload = JSON.stringify({
      type: 'OFFER_RESPONSE',
      amount,
      status,
      originalMessageId: msgId
    });
    handleSend(responsePayload);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  const parseOffer = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (parsed.type === 'OFFER' || parsed.type === 'OFFER_RESPONSE') return parsed;
      return null;
    } catch {
      return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', py: { xs: 2, md: 4 }, px: { xs: 1, md: 2 } }}>
      <Paper elevation={0} sx={{ height: '80vh', display: 'flex', flexDirection: 'column', borderRadius: 4, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
        
        {/* Top Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton component={Link} to="/chat">
            <ArrowLeft />
          </IconButton>
          <Avatar>{conversation?.otherUserName?.[0] || '?'}</Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {conversation?.otherUserName || 'Chat'}
            </Typography>
            <Typography variant="body2" color="primary.main" component={Link} to={`/products/${conversation?.productId}`} sx={{ textDecoration: 'none', fontWeight: 500 }}>
              {conversation?.productTitle || 'View Product'}
            </Typography>
          </Box>
        </Box>

        {/* Message List */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fff' }}>
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.userId;
            const offerData = parseOffer(msg.message);

            return (
              <Box key={msg.messageId} sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                {offerData ? (
                  <Paper 
                    elevation={0} 
                    sx={{ p: 2, borderRadius: 3, minWidth: 200, bgcolor: offerData.status === 'ACCEPTED' ? 'success.50' : 'grey.100', border: '1px solid', borderColor: offerData.status === 'ACCEPTED' ? 'success.300' : 'divider' }}
                  >
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      {offerData.type === 'OFFER' ? 'Made an Offer' : `Offer ${offerData.status}`}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: offerData.type === 'OFFER' && !isMe ? 2 : 0 }}>
                      ₹{offerData.amount?.toLocaleString('en-IN')}
                    </Typography>
                    {offerData.type === 'OFFER' && !isMe && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="contained" color="success" startIcon={<CheckCircle size={16}/>} onClick={() => handleOfferResponse(msg.messageId, offerData.amount, 'ACCEPTED')}>
                          Accept
                        </Button>
                        <Button size="small" variant="outlined" color="error" startIcon={<XCircle size={16}/>} onClick={() => handleOfferResponse(msg.messageId, offerData.amount, 'REJECTED')}>
                          Reject
                        </Button>
                      </Box>
                    )}
                  </Paper>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                    {!isMe && <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>{msg.senderName?.[0]}</Avatar>}
                    <Box sx={{ p: 1.5, px: 2, borderRadius: 3, bgcolor: isMe ? 'primary.main' : 'grey.100', color: isMe ? 'white' : 'text.primary', maxWidth: '75%', wordBreak: 'break-word' }}>
                      <Typography variant="body1">{msg.message}</Typography>
                    </Box>
                  </Box>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, px: 1 }}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            );
          })}
        </Box>
      <Divider />
        {/* Bottom Input Area */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          {showOfferInput && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 2 }}>
              <TextField 
                size="small" 
                placeholder="Offer amount..." 
                type="number" 
                value={offerAmount} 
                onChange={e => setOfferAmount(e.target.value)} 
                fullWidth 
              />
              <Button variant="contained" onClick={handleSendOffer} disabled={!offerAmount}>Send Offer</Button>
              <Button variant="text" onClick={() => setShowOfferInput(false)}>Cancel</Button>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="outlined" onClick={() => setShowOfferInput(!showOfferInput)} sx={{ minWidth: 100, borderRadius: 2, textTransform: 'none' }}>
              Make Offer
            </Button>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton color="primary" onClick={() => handleSend()} sx={{ bgcolor: 'primary.50' }}>
              <Send size={20} />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatConversationPage;
