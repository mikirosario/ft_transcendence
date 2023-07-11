import { createContext, ReactNode } from "react";
import io, { Socket } from "socket.io-client";
import { getServerIP } from './utils/utils';

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }
    }
  }
};

const socket1: Socket = io(getServerIP(8083), socketOptions);
const socket2: Socket = io(getServerIP(8081), socketOptions);

// Crear un contexto para cada socket
export const SocketContext1 = createContext<Socket>(socket1);
export const SocketContext2 = createContext<Socket>(socket2);

// Crear un proveedor para cada socket
export function SocketProvider1({ children }: { children: ReactNode }) {
  return (
    <SocketContext1.Provider value={socket1}>
      {children}
    </SocketContext1.Provider>
  );
}

export function SocketProvider2({ children }: { children: ReactNode }) {
  return (
    <SocketContext2.Provider value={socket2}>
      {children}
    </SocketContext2.Provider>
  );
}
