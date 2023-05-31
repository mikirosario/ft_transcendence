import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/RoundStartButton";
import Logo from '../assets/images/Logo.png'

function PreRegister() {
    const navigate = useNavigate();

    const TitleText: React.CSSProperties = {
        color: 'white',
        fontFamily: "'Press Start 2P'",
        fontSize: '64px',
        fontWeight: 400,
        height: '150px',
        left: '50%',
        top: '25%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute'
      };

    const LogoImg: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
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
            <h1 className="TitleText" style={TitleText}>42PONG</h1>
            <img src={Logo} alt="Logo of 42Pong" style={LogoImg} />
            <section className='AuthLoginButton' style={AuthLoginStyle} onClick={AuthLoginLink}>
                <PlayButton name="LOGIN"/>
            </section>
        </div>
    );
}

export default PreRegister;