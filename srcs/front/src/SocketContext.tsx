import { createContext, ReactNode, useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { getServerIP } from './utils/utils';

const SocketContext1 = createContext<Socket | null>(null);
const SocketContext2 = createContext<Socket | null>(null);

// Crear un proveedor para cada socket
export function SocketProvider1({ children }: { children: ReactNode }) {
  const [socket1, setSocket1] = useState<Socket | null>(null);

  useEffect(() => {
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem("token"),
          }
        }
      }
    };

    setSocket1(io(getServerIP(8083), socketOptions));
  }, []);

  return (
    <SocketContext1.Provider value={socket1}>
      {children}
    </SocketContext1.Provider>
  );
}

export function SocketProvider2({ children }: { children: ReactNode }) {
  const [socket2, setSocket2] = useState<Socket | null>(null);

  useEffect(() => {
    const socketOptions = {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem("token"),
          }
        }
      }
    };

    setSocket2(io(getServerIP(8081), socketOptions));
  }, []);

  return (
    <SocketContext2.Provider value={socket2}>
      {children}
    </SocketContext2.Provider>
  );
}

export { SocketContext1, SocketContext2 };
