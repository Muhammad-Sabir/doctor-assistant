let socketInstance = null;
const baseUrl = process.env.EXPO_PUBLIC_API_URL;

export const getCallSocket = (access_token) => {
  console.log('aceess token in call Socket:', access_token)
  if (!socketInstance || socketInstance.readyState === WebSocket.CLOSED) {
    socketInstance = new WebSocket(`${baseUrl}/ws/call/?token=${access_token}`);
    
    console.log(socketInstance)
    socketInstance.onopen = () => {
      console.log('WebSocket connected for call');
    };

    socketInstance.onclose = () => {
      console.log('WebSocket closed for call');
      socketInstance = null;
    };
  }

  return socketInstance;
};
