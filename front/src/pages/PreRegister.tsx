import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/StartButton";

function PreRegister() {
    const navigate = useNavigate();

    const LogoText: React.CSSProperties = {
        color: 'white',
        fontFamily: "'Press Start 2P'",
        fontSize: '64px',
        fontWeight: 400,
        height: '150px',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
        textAlign: 'center'
      };
    
    const AuthLoginStyle: React.CSSProperties = {
        position: 'absolute',
        top: '80%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

    const AuthLoginLink = () => {
        // window.location.href = 'xxxx'; // Auth URL
        navigate('/register');
    };


    return (
        <div>
            <section className='AuthLoginButton' style={AuthLoginStyle} onClick={AuthLoginLink}>
                <PlayButton name="Login"/>
            </section>
            <h1 className="Logo" style={LogoText}>Logo</h1>

        </div>
    );
}

export default PreRegister;