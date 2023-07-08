import React, { createContext, useEffect, useState, ReactNode } from "react";
import io, { Socket } from "socket.io-client";

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }
    }
  }
};

const socket: Socket = io('http://localhost:8083/', socketOptions);

// Crear un contexto para el socket
export const SocketContext = createContext<Socket>(socket);

// Crear un proveedor del socket
export function SocketProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    socket.on("UPDATE_CHANNELS_LIST", (data: any) => {
      console.log(data);
      setData(data);
    });

    // socket.on("FRIEND_REQUEST_NEW", (data: any) => {
    //   console.log(data);
    //   setData(data);
    // });

    socket.on("FRIEND_REQUEST_ACCEPTED", (data: any) => {
      console.log(data);
      setData(data);
    });

    // socket.on("FRIEND_REQUEST_REJECTED", (data: any) => {
    //   console.log(data);
    //   setData(data);
    // });


  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
