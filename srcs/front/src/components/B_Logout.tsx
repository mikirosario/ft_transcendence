import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton: React.FC = () => {
    const handleLogout = () => {
        localStorage.removeItem('token')
    };

    const [buttonStyle, setButtonStyle] = useState<React.CSSProperties>({
        padding: '10px 20px',
        backgroundColor: '#ff6347',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        fontSize: "'Press Start 2P'",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'transform 0.3s ease',
        textDecoration: 'none',
    });

    const LogoutButtonHoverStyle: React.CSSProperties = {
        ...buttonStyle,
        transform: 'scale(1.1)',
    };

    const LogoutIconStyle: React.CSSProperties = {
        animation: 'spin 2s linear infinite',
    };

    return (
        <Link to={'/'} style={{ textDecoration: 'none' }}> 
            <button style={buttonStyle} 
                    onClick={handleLogout} 
                    onMouseOver={() => setButtonStyle(LogoutButtonHoverStyle)} 
                    onMouseOut={() => setButtonStyle({...buttonStyle, transform: 'scale(1)',})}>
                <FaSignOutAlt style={LogoutIconStyle} />
                Desconectar
            </button>
        </Link>
    );
};

export default LogoutButton;
