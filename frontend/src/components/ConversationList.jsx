// src/components/ConversationList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Badge,
  CircularProgress,
  InputBase,
  IconButton,
  Chip,
} from '@mui/material';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import chatApi from '../services/chatApi';
import EmptyState from './EmptyState';

// Helper to format dates like WhatsApp (today, yesterday, time)
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const oneDay = 24 * 60 * 60 * 1000;
  if (diff < oneDay && date.getDate() === now.getDate()) {
    // Same day – show time
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diff < 2 * oneDay && date.getDate() === now.getDate() - 1) {
    return 'Yesterday';
  }
  // Fallback to locale date
  return date.toLocaleDateString();
};

// Map lastMessageType to readable preview
const previewMessage = (conv) => {
  const { lastMessage, lastMessageType, latestOfferStatus } = conv;
  if (!lastMessage) return 'No messages yet';
  switch (lastMessageType) {
    case 'OFFER':
      return `Offer: ${lastMessage.content}`;
    case 'OFFER_ACCEPTED':
      return 'Offer Accepted';
    case 'OFFER_REJECTED':
      return 'Offer Rejected';
    case 'SYSTEM':
      return lastMessage.content; // e.g., "Product Sold"
    default:
      // Normal text message – truncate to one line
      return lastMessage.content;
  }
};

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Fetch conversation summaries
  const fetchConversations = useCallback(() => {
    setLoading(true);
    chatApi
      .list()
      .then((data) => {
        const sorted = (data || []).sort((a, b) => {
          const aTime = new Date(a.lastMessage?.createdAt || 0).getTime();
          const bTime = new Date(b.lastMessage?.createdAt || 0).getTime();
          return bTime - aTime; // newest first
        });
        setConversations(sorted);
      })
      .catch((err) => {
        console.error('Failed to fetch conversations', err);
        setConversations([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real‑time updates via GlobalWebSocket event "reownx-new-chat-message"
  useEffect(() => {
    const handleUpdate = (e) => {
      // The event payload is expected to contain the conversationId that changed.
      // For simplicity we re‑fetch the whole list; the backend returns lightweight summaries.
      fetchConversations();
    };
    window.addEventListener('reownx-new-chat-message', handleUpdate);
    return () => window.removeEventListener('reownx-new-chat-message', handleUpdate);
  }, [fetchConversations]);

  const filteredConvs = conversations.filter((c) => {
    const term = search.toLowerCase();
    const productName = c.product?.name?.toLowerCase() || '';
    const otherName = c.otherUser?.name?.toLowerCase() || '';
    const lastMsg = c.lastMessage?.content?.toLowerCase() || '';
    return productName.includes(term) || otherName.includes(term) || lastMsg.includes(term);
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!loading && filteredConvs.length === 0) {
    return <EmptyState message="No conversations yet." description="Start by making an offer or sending a message." />;
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 460, mx: 'auto', p: 2 }}>
      {/* Search bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, bgcolor: 'background.paper', borderRadius: 2, px: 2 }}>
        <IconButton disabled>
          <Search size={20} />
        </IconButton>
        <InputBase
          placeholder="Search conversations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ ml: 1 }}
        />
      </Box>

      <List>
        {filteredConvs.map((conv) => (
          <ListItemButton
            key={conv.id}
            component={Link}
            to={`/chat/${conv.id}`}
            alignItems="flex-start"
            sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
          >
            {/* Left side: product thumbnail */}
            <ListItemAvatar>
              <Avatar src={conv.product?.image} alt={conv.product?.name} variant="rounded" />
            </ListItemAvatar>
            {/* Middle: titles and preview */}
            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="600" noWrap>
                  {conv.product?.name || 'Untitled Product'}
                </Typography>
              }
              secondary={
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {conv.otherUser?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {previewMessage(conv)}
                  </Typography>
                </Box>
              }
            />
            {/* Right side: time, badges */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 80 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDate(conv.lastMessage?.createdAt)}
              </Typography>
              {/* Offer status badge */}
              {conv.latestOfferStatus && (
                <Chip
                  label={conv.latestOfferStatus}
                  size="small"
                  sx={{ mt: 0.5, backgroundColor: '#1976d2', color: '#fff' }}
                />
              )}
              {/* Unread count badge */}
              {conv.unreadCount > 0 && (
                <Badge badgeContent={conv.unreadCount} color="primary" sx={{ mt: 0.5 }} />
              )}
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default ConversationList;
