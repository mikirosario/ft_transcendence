import React, { useState } from 'react';

const SwitchChatLadder: React.FC = () => {
  const [isChatSelected, setIsChatSelected] = useState(true);

  const handleChatClick = () => {
    setIsChatSelected(true);
  };

  const handleLadderClick = () => {
    setIsChatSelected(false);
  };

  const buttonStyle = {
    width: '120px',
    height: '30px',
    borderRadius: '15px',
    backgroundColor: isChatSelected ? '#42A5F5' : '#FF8A65',
    display: 'inline-block',
    cursor: 'pointer',
    marginRight: '10px',
  };

  const labelStyle: React.CSSProperties = {
    color: 'white',
    textAlign: 'center',
    lineHeight: '30px',
  };

  const rectangleStyle = {
    width: '250px',
    height: '600px',
    borderRadius: '10px',
    backgroundColor: isChatSelected ? '#42A5F5' : '#FF8A65',
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div>
      <button style={buttonStyle} onClick={handleChatClick}>
        <span style={labelStyle}>Chat</span>
      </button>
      <button style={buttonStyle} onClick={handleLadderClick}>
        <span style={labelStyle}>Ladder</span>
      </button>
      <div style={rectangleStyle}>
        <span style={{ color: 'white' }}>
          {isChatSelected ? 'This is Chat' : 'This is Ladder'}
        </span>
      </div>
    </div>
  );
};

export default SwitchChatLadder;
