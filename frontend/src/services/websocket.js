import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscriptions = new Map();
    this.connectionListeners = [];
  }

  connect(token) {
    if (this.client && this.client.active) {
      return;
    }

    const socketUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/ws`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.isConnected = true;
        this.notifyConnectionListeners(true);
        console.log("WebSocket connected.");
        
        // Resubscribe to existing subscriptions
        this.subscriptions.forEach(({ topic, callback }, subId) => {
          this.client.subscribe(topic, (message) => {
            try {
              callback(JSON.parse(message.body));
            } catch (e) {
              callback(message.body); // Fallback for plain text
            }
          });
        });
      },
      onDisconnect: () => {
        this.isConnected = false;
        this.notifyConnectionListeners(false);
        console.log("WebSocket disconnected.");
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        if (frame.headers['message']?.includes('AccessDeniedException')) {
          toast.error("WebSocket connection denied. Please log in again.");
        }
      },
      onWebSocketError: (event) => {
        console.error('WebSocket Error', event);
      }
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    }
  }

  subscribe(topic, callback) {
    const subId = Math.random().toString(36).substring(7); // Unique ID for this subscription instance
    // Store it so we can re-subscribe on reconnect
    this.subscriptions.set(subId, { topic, callback });
    
    let sub = null;
    if (this.isConnected && this.client) {
      sub = this.client.subscribe(topic, (message) => {
        try {
          callback(JSON.parse(message.body));
        } catch (e) {
          callback(message.body); // Fallback for plain text
        }
      });
    }

    return () => {
      if (sub) {
        sub.unsubscribe();
      }
      this.subscriptions.delete(subId);
    };
  }

  sendBid(auctionId, bidAmount) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: '/app/auction.bid',
        body: JSON.stringify({ auctionId, bidAmount }),
        headers: { 'content-type': 'application/json' }
      });
    } else {
      toast.error('WebSocket not connected');
    }
  }

  sendChatMessage(conversationId, message) {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination: '/app/chat.send',
        body: JSON.stringify({ conversationId, message }),
        headers: { 'content-type': 'application/json' }
      });
    } else {
      toast.error('WebSocket not connected');
    }
  }

  addConnectionListener(listener) {
    this.connectionListeners.push(listener);
    // Trigger immediately with current status
    listener(this.isConnected);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }

  notifyConnectionListeners(status) {
    this.connectionListeners.forEach(l => l(status));
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
