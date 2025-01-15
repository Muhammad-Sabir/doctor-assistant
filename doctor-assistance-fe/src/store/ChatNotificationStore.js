import { create } from 'zustand'
import { getChatSocket } from '@/utils/chatSocket';

export const useChatNotificationStore = create((set, get) => ({
  unreadCount: 0,
  socket: null,

  initializeNotifications: () => {
    let socket = get().socket;
    
    // Only create a new socket if one doesn't exist
    if (!socket) {
      socket = getChatSocket();
      set({ socket });
    }
    
    // Always set up the message handler
    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.source === 'message_send') {
        set((state) => ({ unreadCount: state.unreadCount + 1 }));
      }
    };
  },

  getSocket: () => {
    return get().socket;
  },

  resetCount: () => set({ unreadCount: 0 }),
}));

export default useChatNotificationStore;
