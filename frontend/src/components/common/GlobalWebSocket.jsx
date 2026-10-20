import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import webSocketService from '../../services/websocket';
import toast from 'react-hot-toast';

const GlobalWebSocket = () => {
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (user && token) {
      webSocketService.connect(token);
      
      const unsubscribe = webSocketService.subscribe('/user/queue/notifications', (notification) => {
        if (typeof notification === 'object' && notification.type === 'NEW_MESSAGE') {
          toast.success(`New message from ${notification.senderName}: ${notification.messagePreview}`, { 
            duration: 5000,
            icon: '💬'
          });
          // Dispatch a custom event to trigger Navbar/Sidebar re-fetches if necessary
          window.dispatchEvent(new CustomEvent('reownx-new-chat-message'));
        } else {
          const message = typeof notification === 'string' ? notification : (notification.message || 'Notification');
          toast.success(message, { duration: 5000 });
        }
      });

      return () => {
        unsubscribe();
        webSocketService.disconnect();
      };
    }
  }, [user?.userId, user?.email]);

  return null;
};

export default GlobalWebSocket;
