// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Paper, TextField, IconButton, List, ListItem, Typography, CircularProgress } from '@mui/material';
import { Send } from 'lucide-react';
import chatApi from '../services/chatApi';
import EmptyState from './EmptyState';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatWindow = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch chat messages
  useEffect(() => {
    let mounted = true;
    if (!chatId) return;
    chatApi
      .getMessages(chatId)
      .then((data) => {
        if (mounted) {
          // Expect data.messages array
          setMessages(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error('Failed to load chat', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [chatId]);

  // Auto‑scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    try {
      const sent = await chatApi.sendMessage(chatId, { message: trimmed });
      // Optimistically add to list
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message failed', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && messages.length === 0) {
    return <EmptyState message="No messages yet. Start the conversation!" />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Message list */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <List disablePadding>
          {messages.map((msg) => {
            const isOwn = msg.isOwn; // backend should flag own messages
            return (
              <ListItem
                key={msg.id}
                sx={{
                  display: 'flex',
                  justifyContent: isOwn ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  sx={
                    isOwn
                      ? {
                          p: 1.5,
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          maxWidth: '70%',
                          borderRadius: 2,
                        }
                      : {
                          p: 1.5,
                          bgcolor: 'background.paper',
                          maxWidth: '70%',
                          borderRadius: 2,
                        }
                  }
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      {formatTime(msg.createdAt)}
                    </Typography>
                    {isOwn && msg.read && (
                      <Typography variant="caption" sx={{ ml: 0.5, opacity: 0.7 }}>
                        ✓
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </ListItem>
            );
          })}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input area */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={4}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton color="primary" onClick={handleSend} disabled={!newMessage.trim()}>
                  <Send size={20} />
                </IconButton>
              ),
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;
