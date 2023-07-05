import React from "react";
import { useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/Logo.png'

function Home() {
    const navigate = useNavigate();

    const LogoImg: React.CSSProperties = {
        position: 'absolute',
        width: '110px',
        height: '100px',
        top: '10px',
        left: '10px',
        cursor: 'pointer',
    };

    const AuthLoginLink = () => {
        // window.location.href = 'xxxx'; // Auth URL
        navigate('/homepage');
    };

    return (
        <div>
            {/* <img src={Logo} alt="Logo of 42Pong" style={LogoImg} /> */}
        </div>
    );
}

export default Home;
