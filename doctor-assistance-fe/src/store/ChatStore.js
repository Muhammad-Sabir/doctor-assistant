import { create } from 'zustand'

import { getChatSocket } from '@/utils/chatSocket';


export const useChatStore = create((set, get) => ({
    recipientName: '',
    recipientId: '',
    messages: [],
    socket: null,
    
    initializeChat: () => {
        const socket = getChatSocket();
        
        socket.onmessage = (event) => {
            const response = JSON.parse(event.data);
            const handlers = {
                message_send: () => get().updateChatMessages(response.data),
                message_list: () => set({ messages: response.data.messages }),
            };
            
            handlers[response.source]?.();
        };
        
        set({ 
            socket,
        });
        
        get().fetchMessageHistory();
    },
    
    setRecipient: (id, name) => set({ recipientId: id, recipientName: name }),

    updateChatMessages: (data) => {
        set((state) => ({
            messages: [...state.messages, data.message]
        }));
    },
    
    sendMessage: (message) => {
        const state = get();
        if (!message.trim()) return;
        
        const messageData = {
            source: 'message_send',
            receiver_id: state.recipientId,
            message: message,
        };
        
        state.sendToSocket(messageData);
        
        set((state) => ({
            messages: [
                ...state.messages,
                { 
                    id: state.messages.length + 1, 
                    user: "You", 
                    message: message 
                }
            ]
        }));
    },
    

    sendToSocket: (messageData) => {
        const { socket } = get();
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify(messageData));
        }
    },
    
    fetchMessageHistory: () => {
        const state = get();
        const messageData = { 
            source: 'message_list', 
            receiver_id: state.recipientId 
        };
        state.sendToSocket(messageData);
    },
    
    resetChat: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
        }
        set({ 
            recipientName: '', 
            recipientId: '', 
            messages: [], 
            socket: null 
        });
    }
  }));


export default useChatStore