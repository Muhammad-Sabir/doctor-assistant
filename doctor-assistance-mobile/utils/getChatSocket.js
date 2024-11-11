let socketInstance = null;
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const getChatSocket = (access_token) => {
  console.log('aceess token in chat socket:', access_token)
  if (!socketInstance || socketInstance.readyState === WebSocket.CLOSED) {
    socketInstance = new WebSocket(`${baseUrl}/ws/chat/?token=${access_token}`);
    
    console.log(socketInstance)
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
