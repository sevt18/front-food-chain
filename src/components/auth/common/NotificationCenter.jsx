import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { notificationService } from '../../../services/notificationService';
import './NotificationCenter.css';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    try {
      // Conectar al servicio de notificaciones
      notificationService.connect(user.id);

      // Escuchar notificaciones
      const unsubscribe = notificationService.onNotification((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Mostrar notificación toast si está disponible
        if (window.notify) {
          window.notify.info(notification.message || notification.title);
        }
      });

      // Cargar notificaciones guardadas
      try {
        const saved = JSON.parse(localStorage.getItem(`notifications-${user.id}`) || '[]');
        setNotifications(saved);
        setUnreadCount(saved.filter(n => !n.read).length);
      } catch (storageError) {
        console.warn('Error al cargar notificaciones guardadas:', storageError);
      }

      return () => {
        unsubscribe();
        notificationService.disconnect();
      };
    } catch (error) {
      console.error('Error al inicializar notificaciones:', error);
      setHasError(true);
      // No romper el renderizado si hay error
    }
  }, [user?.id]);

  useEffect(() => {
    // Guardar notificaciones en localStorage
    if (user?.id) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user?.id]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Si hay error, no mostrar el componente para no romper la UI
  if (hasError && !user?.id) {
    return null;
  }

  return (
    <div className="notification-center">
      <button
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notificaciones"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notificaciones</h3>
            <div className="notification-actions">
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="btn-link">
                  Marcar todas como leídas
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} className="btn-link danger">
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id || Date.now()}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'success' && '✅'}
                    {notification.type === 'error' && '❌'}
                    {notification.type === 'warning' && '⚠️'}
                    {(!notification.type || notification.type === 'info') && 'ℹ️'}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title || 'Notificación'}</h4>
                    <p>{notification.message || ''}</p>
                    {notification.timestamp && (
                      <span className="notification-time">
                        {new Date(notification.timestamp).toLocaleString('es-ES')}
                      </span>
                    )}
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

