import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Options from './pages/Options';
import GameSelector from './pages/GameSelector';
import Pong from './pages/Pong';
import Register from './pages/Register';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <div style={{
      backgroundColor: '#7a8f99',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
    }}>
      <Routes>
        <Route path="/">
          <Route index element={<Register />} />
          <Route path="homepage" element={<Home />} />
          <Route path="settings" element={<Options />} />
          <Route path="pong" element={<Pong />} />
          <Route path="gameSelector" element={<GameSelector />} />
        </Route>
      </Routes>
    </div>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
