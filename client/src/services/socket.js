import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5001' : 'https://disaster-management-backend-jyde.onrender.com');

export const socket = io(SOCKET_URL, {
  transports: ['polling', 'websocket'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 8,
  reconnectionDelay: 2000
});

export default socket;
