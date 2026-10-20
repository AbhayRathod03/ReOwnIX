import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Box, Typography, Avatar, TextField, IconButton, CircularProgress, 
  Paper, Button, List, ListItemButton, ListItemAvatar, 
  ListItemText, Badge, useMediaQuery, useTheme, Stack, Container
} from '@mui/material';
import { Send, ArrowLeft, Tag, Check, X, ShieldCheck, MessageCircle, Info } from 'lucide-react';
import chatService from '../services/chatService';
import webSocketService from '../services/websocket';
import offerApi from '../services/offerApi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversationId } = useParams();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [sendingOffer, setSendingOffer] = useState(false);

  const messagesEndRef = useRef(null);
  
  const activeConversation = conversations.find(c => String(c.conversationId) === String(conversationId));

  const fetchConversations = async () => {
    try {
      const data = await chatService.listConversations();
      setConversations(data || []);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchMessages = async () => {
    if (!conversationId) return;
    try {
      const msgs = await chatService.getMessages(conversationId);
      setMessages(msgs || []);
      await chatService.markRead(conversationId);
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      setLoadingChat(true);
      fetchMessages();
      
      const unsubscribe = webSocketService.subscribe(`/topic/chat/${conversationId}`, (newMsg) => {
        setMessages(prev => {
          if (prev.some(m => m.messageId === newMsg.id || m.id === newMsg.id)) return prev;
          const formattedMsg = {
            messageId: newMsg.id,
            senderId: newMsg.senderId,
            senderName: newMsg.senderName,
            message: newMsg.message,
            isRead: true,
            createdAt: newMsg.timestamp
          };
          return [...prev, formattedMsg];
        });
        
        chatService.markRead(conversationId).catch(console.error);
        setTimeout(scrollToBottom, 100);
      });

      return () => unsubscribe();
    }
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectConversation = (conv) => {
    navigate(`/chat/${conv.conversationId}`);
  };

  const handleSendMessage = async (content = newMessage.trim()) => {
    if (!content || !conversationId) return;
    try {
      webSocketService.sendChatMessage(conversationId, content);
      setNewMessage('');
      setTimeout(scrollToBottom, 100);
    } catch (err) {
      toast.error('Failed to send message');
    }
  };

  const handleSendOffer = async () => {
    const amount = Number(offerAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    try {
      setSendingOffer(true);
      let newOffer = null;
      try {
        // 1. Try to sync with backend API (Will fail if user is the Seller)
        newOffer = await offerApi.makeOffer({ productId: activeConversation.productId, amount });
      } catch (err) {
        console.warn("Backend offer creation skipped (likely seller making a counter-offer in chat).");
      }
      
      // 2. Broadcast via WebSocket
      const offerPayload = JSON.stringify({
        type: 'OFFER',
        amount: amount,
        status: 'PENDING',
        offerId: newOffer?.id
      });
      handleSendMessage(offerPayload);
      
      setShowOfferForm(false);
      setOfferAmount('');
      toast.success("Offer sent!");
    } catch (err) {
      toast.error('Failed to send offer');
    } finally {
      setSendingOffer(false);
    }
  };

  const handleRespondToOffer = async (msgId, offerId, amount, status) => {
    try {
      // 1. Sync with backend API if offerId exists
      if (offerId) {
        await offerApi.updateOfferStatus(offerId, status);
      }
      
      // 2. Broadcast response
      const responsePayload = JSON.stringify({
        type: 'OFFER_RESPONSE',
        amount: amount,
        status: status,
        originalMessageId: msgId,
        offerId: offerId
      });
      handleSendMessage(responsePayload);
      toast.success(`Offer ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update offer');
    }
  };

  const parsePayload = (text) => {
    try {
      const parsed = JSON.parse(text);
      if (parsed.type === 'OFFER' || parsed.type === 'OFFER_RESPONSE' || parsed.type === 'SYSTEM') return parsed;
      return null;
    } catch {
      return null;
    }
  };

  const renderSidebar = () => (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight="900">Messages</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
        {loadingList ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress size={30} /></Box>
        ) : conversations.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <MessageCircle size={40} color="#CBD5E1" style={{ marginBottom: 12 }} />
            <Typography variant="body1" fontWeight="bold" color="text.secondary">No conversations yet</Typography>
            <Typography variant="body2" color="text.secondary">Start by making an offer on a product.</Typography>
          </Box>
        ) : (
          conversations.map((conv) => (
            <ListItemButton 
              key={conv.conversationId} 
              onClick={() => handleSelectConversation(conv)}
              selected={String(conv.conversationId) === String(conversationId)}
              sx={{ 
                p: 2,
                borderBottom: '1px solid', borderColor: 'divider',
                '&.Mui-selected': { bgcolor: 'primary.50' }
              }}
            >
              <ListItemAvatar>
                <Badge badgeContent={conv.unreadCount} color="error">
                  <Avatar src={conv.productThumbnail} alt={conv.productTitle} sx={{ width: 56, height: 56, borderRadius: 2 }} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                sx={{ ml: 2 }}
                primary={<Typography variant="subtitle1" fontWeight={conv.unreadCount > 0 ? 'bold' : 600} noWrap>{conv.otherUserName}</Typography>}
                secondary={
                  <Box>
                    <Typography variant="body2" color="primary.main" fontWeight="500" noWrap>{conv.productTitle}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {conv.lastMessage}
                    </Typography>
                  </Box>
                }
              />
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  );

  const renderOfferBubble = (msg, parsed) => {
    const isMine = String(msg.senderId) === String(user?.userId);
    const isResponse = parsed.type === 'OFFER_RESPONSE';
    
    // Check if this offer has already been responded to later in the chat
    const hasResponse = !isResponse && messages.some(m => {
      if (m.createdAt <= msg.createdAt) return false;
      const p = parsePayload(m.message);
      return p && p.type === 'OFFER_RESPONSE' && String(p.originalMessageId) === String(msg.messageId);
    });

    // If it has a response, it is no longer pending action.
    const isPending = parsed.status === 'PENDING' && !hasResponse;

    let bgColor = 'grey.50';
    let borderColor = 'grey.300';
    let statusText = parsed.status;
    let Icon = Tag;
    let iconColor = 'primary.main';

    if (parsed.status === 'ACCEPTED') {
      bgColor = '#ecfdf5';
      borderColor = '#34d399';
      Icon = ShieldCheck;
      iconColor = '#10b981';
      statusText = isResponse ? 'Offer Accepted' : 'Offer was Accepted';
    } else if (parsed.status === 'REJECTED') {
      bgColor = '#fef2f2';
      borderColor = '#fca5a5';
      Icon = X;
      iconColor = '#ef4444';
      statusText = 'Offer Rejected';
    } else if (parsed.status === 'PENDING') {
      bgColor = '#FFFBEB';
      borderColor = '#FCD34D';
      iconColor = '#D97706';
      if (hasResponse) {
        statusText = 'RESPONDED';
        bgColor = 'grey.50';
        borderColor = 'grey.300';
        iconColor = 'text.secondary';
      }
    }

    return (
      <Paper variant="outlined" sx={{ p: 2, minWidth: 260, bgcolor: bgColor, borderColor, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <Icon size={20} color={iconColor} />
          <Typography variant="caption" fontWeight="800" color={iconColor} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {statusText}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="900" sx={{ mb: 1, color: 'text.primary', letterSpacing: '-1px' }}>
          ₹{Number(parsed.amount).toLocaleString('en-IN')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: isPending ? 2 : 0 }}>
          {isMine ? 'Sent by you' : `Sent by ${msg.senderName}`}
        </Typography>

        {isPending && !isMine && (
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Button 
              size="small" 
              variant="contained" 
              color="success" 
              startIcon={<Check size={16} />}
              onClick={() => handleRespondToOffer(msg.messageId, parsed.offerId, parsed.amount, 'ACCEPTED')}
              fullWidth
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Accept
            </Button>
            <Button 
              size="small" 
              variant="outlined" 
              color="error"
              onClick={() => handleRespondToOffer(msg.messageId, parsed.offerId, parsed.amount, 'REJECTED')}
              fullWidth
              sx={{ borderRadius: 2, fontWeight: 'bold' }}
            >
              Reject
            </Button>
          </Stack>
        )}
        {isPending && isMine && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center', fontWeight: 'bold' }}>
            Waiting for response...
          </Typography>
        )}
      </Paper>
    );
  };

  const renderSystemMessage = (msg, parsed) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <Paper elevation={0} sx={{ py: 1, px: 2, bgcolor: 'grey.100', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info size={16} color="#64748B" />
          <Typography variant="caption" fontWeight="bold" color="text.secondary">
            {parsed.text || msg.message}
          </Typography>
        </Paper>
      </Box>
    );
  };

  const renderActiveChat = () => {
    if (!conversationId) {
      return (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8FAFC' }}>
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <MessageCircle size={64} style={{ opacity: 0.2, marginBottom: 16 }} />
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>Your Messages</Typography>
            <Typography variant="body1">Select a conversation from the sidebar to start chatting.</Typography>
          </Box>
        </Box>
      );
    }

    const isProductSold = messages.some(msg => {
      const parsed = parsePayload(msg.message);
      return parsed && parsed.status === 'ACCEPTED';
    });

    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F8FAFC' }}>
        
        {/* Product Context Header */}
        {activeConversation && (
          <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', borderRadius: 0, zIndex: 10, bgcolor: 'white' }}>
            {isMobile && (
              <IconButton onClick={() => navigate('/chat')} sx={{ mr: 1 }}><ArrowLeft /></IconButton>
            )}
            <Avatar src={activeConversation.productThumbnail} variant="rounded" sx={{ width: 60, height: 60, mr: 2, borderRadius: 2 }} />
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight="bold" noWrap>{activeConversation.productTitle}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>Seller: {activeConversation.otherUserName}</span>
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981' }} />
                <span style={{ color: '#10B981', fontWeight: 500 }}>Online</span>
              </Typography>
            </Box>
            <Button 
              component={Link} 
              to={`/products/${activeConversation.productId}`}
              variant="contained"
              color="primary"
              size="small"
              sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', px: 3, display: { xs: 'none', sm: 'inline-flex' } }}
            >
              View Listing
            </Button>
          </Paper>
        )}

        {/* Message Feed */}
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflowY: 'auto' }}>
          {loadingChat ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : messages.length === 0 ? (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>Say hello or make an offer!</Typography>
          ) : (
            messages.map((msg) => {
              const parsedData = parsePayload(msg.message);
              
              if (parsedData?.type === 'SYSTEM') {
                return <React.Fragment key={msg.messageId}>{renderSystemMessage(msg, parsedData)}</React.Fragment>;
              }
              
              if (parsedData?.type === 'OFFER_RESPONSE') {
                 const isMe = String(msg.senderId) === String(user?.userId);
                 const actor = isMe ? 'You' : msg.senderName;
                 const text = `${actor} ${parsedData.status.toLowerCase()} the offer of ₹${Number(parsedData.amount).toLocaleString('en-IN')}`;
                 return <React.Fragment key={msg.messageId}>{renderSystemMessage(msg, { text })}</React.Fragment>;
              }

              const isMine = String(msg.senderId) === String(user?.userId);

              return (
                <Box key={msg.messageId} sx={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', mb: 2.5 }}>
                  {!isMine && (
                    <Avatar sx={{ width: 36, height: 36, mr: 1.5, mt: 'auto', bgcolor: 'primary.100', color: 'primary.main', fontWeight: 'bold' }}>
                      {msg.senderName?.charAt(0) || 'U'}
                    </Avatar>
                  )}
                  <Box sx={{ maxWidth: '80%' }}>
                    {parsedData && parsedData.type === 'OFFER' ? (
                      renderOfferBubble(msg, parsedData)
                    ) : (
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: 2, 
                          bgcolor: isMine ? 'primary.main' : 'white', 
                          color: isMine ? 'white' : 'text.primary',
                          borderRadius: isMine ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        }}
                      >
                        <Typography variant="body1" sx={{ wordBreak: 'break-word', lineHeight: 1.5 }}>
                          {msg.message}
                        </Typography>
                      </Paper>
                    )}
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, px: 1, color: 'text.secondary', textAlign: isMine ? 'right' : 'left', fontWeight: 500 }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Message Input */}
        <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid', borderColor: 'divider' }}>
          {showOfferForm && (
            <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider', bgcolor: '#F8FAFC' }}>
              <Tag size={20} color="#64748B" />
              <Typography variant="subtitle2" fontWeight="bold" color="text.secondary">Make Offer:</Typography>
              <TextField 
                size="small" 
                placeholder="₹ Amount" 
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                sx={{ width: 140, bgcolor: 'white' }}
                autoFocus
              />
              <Button variant="contained" size="small" onClick={handleSendOffer} disabled={sendingOffer} sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                {sendingOffer ? 'Sending...' : 'Send Offer'}
              </Button>
              <IconButton size="small" onClick={() => setShowOfferForm(false)} sx={{ ml: 'auto' }}><X size={20} /></IconButton>
            </Paper>
          )}

          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
            {!showOfferForm && !isProductSold && (
              <Button 
                variant="outlined" 
                startIcon={<Tag size={18} />} 
                onClick={() => setShowOfferForm(true)}
                sx={{ borderRadius: '24px', textTransform: 'none', px: 3, py: 1.5, flexShrink: 0, fontWeight: 'bold' }}
              >
                Make Offer
              </Button>
            )}
            {isProductSold && (
              <Box sx={{ px: 2, py: 1, bgcolor: 'success.50', color: 'success.main', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 1, border: '1px solid', borderColor: 'success.200' }}>
                <ShieldCheck size={18} />
                <Typography variant="body2" fontWeight="bold">Product Sold</Typography>
              </Box>
            )}
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !showOfferForm) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '24px', bgcolor: 'grey.50', '&.Mui-focused': { bgcolor: 'white' } } }}
            />
            <IconButton 
              color="primary" 
              onClick={() => handleSendMessage()} 
              disabled={!newMessage.trim()}
              sx={{ 
                bgcolor: newMessage.trim() ? 'primary.main' : 'grey.100', 
                color: newMessage.trim() ? 'white' : 'grey.400',
                p: 1.5,
                '&:hover': { bgcolor: 'primary.dark' } 
              }}
            >
              <Send size={22} />
            </IconButton>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 80px)', py: 2 }}>
      <Paper elevation={3} sx={{ display: 'flex', height: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
        
        {(!isMobile || !conversationId) && (
          <Box sx={{ width: { xs: '100%', md: 340, lg: 400 }, flexShrink: 0, borderRight: '1px solid', borderColor: 'divider' }}>
            {renderSidebar()}
          </Box>
        )}

        {(!isMobile || conversationId) && (
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {renderActiveChat()}
          </Box>
        )}

      </Paper>
    </Container>
  );
};

export default ChatPage;
