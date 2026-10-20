// src/pages/ChatListPage.jsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Badge, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService';
import toast from 'react-hot-toast';

const ChatListPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConversations = async () => {
    if (document.hidden) return; // Pause polling when hidden
    try {
      const data = await chatService.listConversations();
      setConversations(data);
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    window.addEventListener('reownx-new-chat-message', fetchConversations);
    const interval = setInterval(fetchConversations, 60000); // 60s fallback polling
    return () => {
      clearInterval(interval);
      window.removeEventListener('reownx-new-chat-message', fetchConversations);
    };
  }, []);

  const handleClick = (conv) => {
    navigate(`/chat/${conv.conversationId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        My Chats
      </Typography>
      {conversations.length === 0 ? (
        <Typography>No conversations yet.</Typography>
      ) : (
        <List>
          {conversations.map((conv) => (
            <ListItemButton key={conv.conversationId} onClick={() => handleClick(conv)}>
              <ListItemAvatar>
                <Badge badgeContent={conv.unreadCount} color="secondary" invisible={conv.unreadCount === 0}>
                  <Avatar src={conv.productThumbnail} alt={conv.productTitle} />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={conv.productTitle}
                secondary={
                  <>
                    {conv.lastMessage?.slice(0, 50)}
                    {conv.lastMessage && conv.lastMessage.length > 50 ? '…' : ''}
                  </>
                }
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ChatListPage;
