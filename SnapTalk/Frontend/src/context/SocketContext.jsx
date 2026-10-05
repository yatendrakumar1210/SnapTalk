import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { initSocket, getSocket } from '../services/socket';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Map());

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketInstance = initSocket(token);
      setSocket(socketInstance);

      const onConnect = () => setIsConnected(true);
      const onDisconnect = () => setIsConnected(false);

      const onUserOnline = ({ userId }) => {
        setOnlineUsers(prev => new Map(prev).set(userId, 'Online'));
      };

      const onUserOffline = ({ userId }) => {
        setOnlineUsers(prev => {
          const next = new Map(prev);
          next.delete(userId);
          return next;
        });
      };

      socketInstance.on('connect', onConnect);
      socketInstance.on('disconnect', onDisconnect);
      socketInstance.on('user:online', onUserOnline);
      socketInstance.on('user:offline', onUserOffline);

      setIsConnected(socketInstance.connected);

      return () => {
        socketInstance.off('connect', onConnect);
        socketInstance.off('disconnect', onDisconnect);
        socketInstance.off('user:online', onUserOnline);
        socketInstance.off('user:offline', onUserOffline);
      };
    } else {
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
