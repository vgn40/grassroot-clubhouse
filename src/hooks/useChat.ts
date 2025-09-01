import { useState } from 'react';

export const useChat = () => {
  // Mock unread count - in a real app this would come from the API
  const [unreadCount] = useState(3);

  return {
    unreadCount: unreadCount > 0 ? unreadCount : null,
  };
};