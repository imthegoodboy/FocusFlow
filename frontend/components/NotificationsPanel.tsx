'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    checkNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/api/notifications?unread_only=true');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.notifications?.filter((n: Notification) => !n.read).length || 0);
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  const checkNotifications = async () => {
    try {
      await api.post('/api/notifications/check');
      loadNotifications();
    } catch (error) {
      // Ignore errors
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-red-100 border-red-300';
      case 'warning': return 'bg-yellow-100 border-yellow-300';
      case 'success': return 'bg-green-100 border-green-300';
      default: return 'bg-blue-100 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        {unreadCount > 0 && (
          <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-lg border ${getTypeColor(notif.type)} ${
                !notif.read ? 'font-semibold' : ''
              } cursor-pointer hover:shadow-md transition-shadow`}
              onClick={() => markAsRead(notif.id)}
            >
              <p className="text-sm font-medium">{notif.title}</p>
              <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(notif.created_at), 'MMM d, h:mm a')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

