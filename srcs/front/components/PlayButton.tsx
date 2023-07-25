'use client'

import React, { useState } from 'react';
import { Press_Start_2P } from 'next/font/google';

const PS2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  });

export default function RoundStartButton({ name }: any) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    background: isHovered
      ? 'linear-gradient(45deg, rgba(122,151,204,1) 0%, rgba(102,204,102,1) 100%)'
      : 'linear-gradient(45deg, rgba(122,151,204,1) 0%, rgba(102,204,102,1) 100%)',
    color: isHovered 
      ? 'white'
      : 'black',
    borderRadius: '100px',
    width: '255px',
    height: '110px',
    fontSize: '32px',
    fontStyle: 'normal',
    display: 'swap',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    border: isHovered
      ? '2px solid white'
      : 'none',
    textShadow: '2px 2px 0px rgba(0, 0, 0, 0.4)'
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={PS2P.className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {name}
    </button>
  );
}

