let socketInstance = null;

export const getChatSocket = (token) => {
  if (!socketInstance || socketInstance.readyState === WebSocket.CLOSED) {
    socketInstance = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${token}`);

    socketInstance.onopen = () => {
      console.log('WebSocket connected.');
    };

    socketInstance.onclose = () => {
      console.log('WebSocket closed.');
      socketInstance = null;
    };
  }

  return socketInstance;
};
