import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/assets/css/index.module.css';
// import App from './App';
import reportWebVitals from '../src/reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../src/pages/Homepage';
import Options from '../src/pages/Options';
import GameSelector from '../src/pages/GameSelector';
import PongPage from '../src/pages/Pong';
import Register from '../src/pages/Register';
import PreRegister from '../src/pages/PreRegister';
import { io, Socket } from 'socket.io-client';
import Verification2af from '../src/pages/Verification2AF';
import { getServerIP } from '../src/utils/utils';


const socketOptions = {
  transportOptions: {
      polling: {
          extraHeaders: {
              Authorization: 'Bearer ' + localStorage.getItem("token"),
          }
      }
  }
};

const socket: Socket = io(getServerIP(8081), socketOptions);

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
