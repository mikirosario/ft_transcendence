import React, { useEffect } from "react";
import * as Pong from "./pong/pong";




function PongPage() {

    useEffect(() => {
        Pong.main();
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
        backgroundColor: "blue", // "#66CC66"
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

    var font: FontFace = new FontFace('press_start_2p', './fonts/PressStart2P-Regular.ttf format(\'truetype\')', {style: 'normal', weight: 'normal'});

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
