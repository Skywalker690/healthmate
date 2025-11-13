import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
  }

  connect(userEmail, onNotification) {
    if (this.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const socket = new SockJS(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/ws`);
    
    this.client = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log('STOMP:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.client.onConnect = () => {
      console.log('WebSocket connected');
      this.connected = true;

      // Subscribe to user-specific notifications
      const subscription = this.client.subscribe(
        '/user/queue/notifications',
        (message) => {
          try {
            const notification = JSON.parse(message.body);
            console.log('Received notification:', notification);
            if (onNotification) {
              onNotification(notification);
            }
          } catch (error) {
            console.error('Error parsing notification:', error);
          }
        }
      );

      this.subscriptions.set('notifications', subscription);
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    this.client.onWebSocketClose = () => {
      console.log('WebSocket closed');
      this.connected = false;
    };

    this.client.activate();
  }

  disconnect() {
    if (this.client && this.connected) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();
      this.client.deactivate();
      this.connected = false;
      console.log('WebSocket disconnected');
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();
