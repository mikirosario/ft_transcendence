import React, { useEffect, useState } from "react";
import * as Pong from "./pong/pong";
import { io, Socket } from 'socket.io-client';
import { getServerIP } from "../utils/utils";
import { Console } from "console";


const socketOptions = {
  transportOptions: {
      polling: {
          extraHeaders: {
              Authorization: 'Bearer ' + localStorage.getItem("token"),
          }
      }
  },
  autoConnect: false
};


function PongPage() {

    var font = new FontFace('press_start_2p', 'url(/fonts/PressStart2P-Regular.ttf) format(\'truetype\')', {style: 'normal', weight: 'normal'});

    font.load().then(function (loadedFont) {
        document.fonts.add(loadedFont);
        document.body.style.fontFamily = 'press_start_2p, monospace, sans-serif';
    }).catch(function (error) {
        console.log('Failed to load font: ' + error);
    });

    const ErrorMessage: React.CSSProperties = {
        display: 'none',
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: 'red',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
    };

    const CanvasContainer: React.CSSProperties = {
        backgroundColor: "blue",
        display: 'inline-block',
        position: 'relative',
    };

    const PageStyle: React.CSSProperties = {
        textAlign: 'center',
        backgroundColor: 'ghostwhite',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        position: 'fixed',
        width: '100%',
        margin: '0',
        overflow: 'hidden'
    };

    useEffect(() => {
        const socket: Socket = io(getServerIP(8082), socketOptions);
        Pong.main(socket);
    
        return () => {
            socket.close();
        };
    });

    return (
        <div className="Pong" style={PageStyle}>
            <h1>The Original Pong</h1>
            <div id="error-message" style={ErrorMessage}></div>
            <div id="canvas-container" style={CanvasContainer}>
                <canvas id="pong" width="640" height="480"></canvas>
            </div>
            <p>Move paddle with up and down arrow keys.</p>
        </div>
    );
}

export default PongPage;
