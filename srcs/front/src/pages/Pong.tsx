import React, { useEffect, useState } from "react";
import HomeButton from "../components/B_Home";
import * as Pong from "./pong/pong";
import { io, Socket } from 'socket.io-client';
import { getServerIP } from "../utils/utils";
import { Console } from "console";
import { useNavigate, useParams } from "react-router-dom";


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
const socket: Socket = io(getServerIP(8082), socketOptions);

function PongPage() {

    const { gameUserId } = useParams();
    const { spectateUserId } = useParams();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [spectateExist, setSpectateExist] = useState(true);
    
    useEffect(() => {
        if (gameUserId || spectateUserId) {
            if ((isNaN(Number(spectateUserId)) && !gameUserId) || (isNaN(Number(gameUserId)) && !spectateUserId))
                navigate('/homepage');
        }
    }, []);
    
    useEffect(() => {
        // socket.connect();
        socket.on('connect', () => {
            console.log('Conectando al juego...');

            // Enviar datos al servidor
            const dataToSend = { gameUserId: gameUserId ? gameUserId : '', spectateUserId: spectateUserId ? spectateUserId : '' };
      
            socket.emit('game_connection', dataToSend);
        });

        socket.on('player-id', () => {
            setIsPlaying(true);
        });

        socket.on('spectate_match_not_found', () => {
            setSpectateExist(false);
        });

        Pong.main(socket);


        return () => {
            setIsPlaying(false);
            socket.off();
            if (socket.connected)
                socket.disconnect();
        };
    }, [gameUserId, spectateUserId]);

    // useEffect(() => {
    //     var font = new FontFace('press_start_2p', 'url(/fonts/PressStart2P-Regular.ttf) format(\'truetype\')', { style: 'normal', weight: 'normal' });
        
    //     font.load().then(function (loadedFont) {
    //         document.fonts.add(loadedFont);
    //         document.body.style.fontFamily = 'press_start_2p, monospace, sans-serif';
    //     }).catch(function (error) {
    //         console.log('Failed to load font: ' + error);
    //     });
    // }, []);


    
    const [counter, setCounter] = useState(0);
 
    useEffect(() => {
        const interval = setInterval(() => {
            setCounter(prevCounter => {
                const nextCounter = prevCounter + 1;
                let maxCount;
                if (!spectateUserId)
                maxCount = '¡Esperando a otro jugador!'.length + 1;
                else
                maxCount = '¡No se encuentra partida!'.length + 1;
                
                if (nextCounter >= maxCount)
                return 0;
                
                return nextCounter;
            });
        }, 150);
        return () => clearInterval(interval);
    }, []);

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
        backgroundColor: 'lightgray',
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

    const WaitingPlayerStyle: React.CSSProperties = {
        width: '520px',
        height: '30px',
        fontSize: '20px',
        color: 'lightgray',
        fontFamily: "'Press Start 2P'",
        position: 'absolute'
    };

    const generateText = (text: string) => {
        const characters = text.split('');
        const totalLength = text.length;
        return characters.map((char, index) => {
            let color;
            if ((index >= counter && index < counter + 4) ||
                (counter > totalLength - 4 && index < (counter + 4) % totalLength)) {
                color = '#FFE900';
            } else {
                color = 'white';
            }
            return <span key={index} style={{ color }}>{char}</span>;
        });
    };

    return (
        <div className="Pong" style={PageStyle}>
            <HomeButton></HomeButton>
            <h1 style={{fontFamily: "'Press Start 2P'"}}>The Original Pong</h1>
            <div id="error-message" style={ErrorMessage}></div>
            <div id="canvas-container" style={CanvasContainer}>
                <canvas id="pong" width="640" height="480"></canvas>
            </div>
            {
                !spectateUserId ?
                    (
                        !isPlaying
                            ? <p style={WaitingPlayerStyle}>{generateText('¡Esperando a otro jugador!')}</p>
                            : <p></p>
                    )
                    :
                    (
                        !spectateExist
                            ? <p style={WaitingPlayerStyle}>{generateText('¡No se encuentra partida!')}</p>
                            : <p></p>
                    )
            }
            { !spectateUserId ?
                <p style={{fontFamily: "'Press Start 2P'"}}>Mueve la pala con las teclas ↑ ↓</p> : <p>Estas en modo espectador</p>}

        </div>
    );
}

export default PongPage;
