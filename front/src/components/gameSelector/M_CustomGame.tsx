import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function M_CustomGame() {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    
    const Body: React.CSSProperties = {
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }

    const Button: React.CSSProperties = {
      width: '200px',
      height: '50px',
      borderRadius: '30px',
      fontStyle: 'normal',
      fontFamily: "'Press Start 2P'",
      fontSize: '18px',
      color: 'white',
      textShadow: '2px 2px 0px rgba(0, 0, 0, 0.4)',
      background: isHovered
        ? 'linear-gradient(0deg, rgba(70,140,70,0.7) 0%, rgba(108,217,108,0.7) 100%)'
        : 'linear-gradient(0deg, rgba(70,140,70,1) 0%, rgba(108,217,108,1) 100%)',
      border: isHovered
        ? '3px solid rgba(255,255,255,0.7)'
        : 'none',
    }

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const CustomRedirect = () => {
      navigate('/pong');
    };

    return (
      <div style={Body}>
          <button style={Button}
            onClick={CustomRedirect}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >PLAY</button>
      </div>
    );
}

export default M_CustomGame;