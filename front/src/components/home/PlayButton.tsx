import React, { useState } from 'react';

const PlayButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    background: isHovered
      ? 'linear-gradient(180deg, rgba(0,255,0,1) 0%, rgba(255,255,255,1) 100%)'
      : 'linear-gradient(180deg, rgba(238,14,14,1) 0%, rgba(255,255,255,0.75) 100%)',
    color: 'black',
    borderRadius: '25px',
    width: '150px',
    height: '50px',
    fontFamily: 'Quantico',
    fontWeight: 'bold',
    fontSize: '25px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)'
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
      className='PlayButton'
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      Play now
    </button>
  );
}

export default PlayButton;
