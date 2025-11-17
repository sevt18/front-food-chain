import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class NotificationService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect(userId) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.socket.on('connect', () => {
      console.log('✅ Conectado al servidor de notificaciones');
      this.isConnected = true;
      
      if (userId) {
        this.socket.emit('join-user-room', userId);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor de notificaciones');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Error en conexión WebSocket:', error);
    });

    // Escuchar notificaciones
    this.socket.on('notification', (notification) => {
      this.handleNotification(notification);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinProductRoom(productId) {
    if (this.socket?.connected) {
      this.socket.emit('join-product-room', productId);
    }
  }

  onNotification(callback) {
    const id = Date.now().toString();
    this.listeners.set(id, callback);
    return () => this.listeners.delete(id);
  }

  handleNotification(notification) {
    this.listeners.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error en callback de notificación:', error);
      }
    });
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }
}

export const notificationService = new NotificationService();

