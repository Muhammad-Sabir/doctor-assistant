import { getAuthStatus } from '@/utils/auth';

let socketInstance = null;

export const getChatSocket = () => {
  if (!socketInstance || socketInstance.readyState === WebSocket.CLOSED) {
	const { access_token } = getAuthStatus().user;
    socketInstance = new WebSocket(`ws://127.0.0.1:8000/ws/chat/?token=${access_token}`);

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
