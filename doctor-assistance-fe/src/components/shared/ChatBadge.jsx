import React from 'react';
import useChatNotificationStore from '@/store/ChatNotificationStore';

export default function ChatBadge() {
  const { unreadCount } = useChatNotificationStore();

  if (unreadCount === 0) return null;
  console.log('unreadCount', unreadCount);

  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xxs rounded-full h-3.5 w-3.5 flex items-center justify-center">
      {unreadCount}
    </span>
  );
} 