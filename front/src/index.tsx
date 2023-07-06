import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Homepage';
import Options from './pages/Options';
import GameSelector from './pages/GameSelector';
import PongPage from './pages/Pong';
import Register from './pages/Register';
import PreRegister from './pages/PreRegister';
import { io, Socket } from 'socket.io-client';
import Verification2af from './pages/Verification2AF';


const socketOptions = {
  transportOptions: {
      polling: {
          extraHeaders: {
              Authorization: 'Bearer ' + localStorage.getItem("token"),
          }
      }
  }
};

const socket: Socket = io('http://localhost:8081/', socketOptions);

// Si no esta logeado no puede acceder a ninguna ruta

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
  );
  root.render(
    <BrowserRouter>
    <div style={{
      backgroundColor: '#0E1625',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
    }}>
      <Routes>
        <Route path="/">
          <Route index element={<PreRegister />} />
          <Route path="register" element={<Register />} />
          <Route path="homepage" element={<Home />} />
          <Route path="settings" element={<Options />} />
          <Route path="pong" element={<PongPage />} />
          <Route path="gameSelector" element={<GameSelector />} />
          <Route path="verification" element={<Verification2af />} />
        </Route>
      </Routes>
    </div>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
