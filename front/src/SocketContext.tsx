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

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
