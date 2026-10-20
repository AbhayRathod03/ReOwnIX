// src/pages/Chat.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
/**
 * Simple placeholder for the chat feature.
 * In a full implementation this would contain the messaging UI.
 */
const Chat = () => (
  <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 4, px: 2 }}>
    <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
      Chat
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Chat functionality is under construction. Stay tuned!
    </Typography>
  </Box>
);

export default Chat;
