import React, { useState } from 'react';

interface Args{
  name: string;
}

const RoundStartButton: React.FC<Args> = (args) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    background: isHovered
      ? 'linear-gradient(180deg, rgba(0,255,0,1) 0%, rgba(255,255,255,1) 100%)'
      : 'linear-gradient(180deg, rgba(238,14,14,1) 0%, rgba(255,255,255,0.75) 100%)',
    color: 'white',
    borderRadius: '25px',
    width: '150px',
    height: '50px',
    fontFamily: "'Press Start 2P'",
    fontSize: '20px',
    fontStyle: 'normal',
    display: 'swap',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.4)'
    // transition: 'background-color 0.3s' Not rowking
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className='RoundStartButton'
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {args.name}
    </button>
  );
}

export default RoundStartButton;
