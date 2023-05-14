import React from 'react';
import { Route, Link, Router } from "react-router-dom";
import logo from './assets/images/logo.svg';
import Home from './pages/Home';
import Options from './pages/Options';
import './assets/css/App.css';
import { io, Socket } from 'socket.io-client';


const socketOptions = {
  transportOptions: {
      polling: {
          extraHeaders: {
              Authorization: localStorage.getItem("token"),
          }
      }
  }
};

const socket: Socket = io('http://localhost:8081/', socketOptions);

const App: React.FC = () => {
  return (
    <div className="App">
      


    </div>
  );
};


export default App;
