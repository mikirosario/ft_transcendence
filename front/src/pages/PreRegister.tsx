import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/StartButton";
//import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PreRegister() {
    //const navigate = useNavigate();

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

    const AuthLoginLink = async () => {
        try{
            const response = await axios.get('http://localhost:3000/oauth/generateAuthURL');
            const authUrl = response.data.url;
            console.log(authUrl);
            window.location.href = authUrl;
        } catch (error){
            console.log('Failed to retrieve OAuth URL: ', error);
        }
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
