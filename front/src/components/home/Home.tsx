import React from "react";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const LogoText: React.CSSProperties = {
        color: 'white',
        fontFamily: "'Press Start 2P'",
        fontSize: '32px',
        fontWeight: 400,
        position: 'absolute',
        top: '0px',
        left: '20px',
        cursor: 'pointer',
    };

    const AuthLoginLink = () => {
        // window.location.href = 'xxxx'; // Auth URL
        navigate('/homepage');
    };

    return (
        <div>
            <h1 className="Logo" style={LogoText} onClick={AuthLoginLink}>
                Logo
            </h1>
        </div>
    );
}

export default Home;
