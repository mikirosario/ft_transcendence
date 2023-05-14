import React, { useState } from 'react';

const ChatLadderSwitch: React.FC = () => {
  const [isChatSelected, setIsChatSelected] = useState<boolean>(true);

  const handleSwitchChange = () => {
    setIsChatSelected(!isChatSelected);
  }

  const selectedOptionStyle = {
    backgroundColor: isChatSelected ? 'green' : 'blue',
    width: '20vw',
    height: '75vh',
  
    marginTop: 10,
  };

  return (
    <div>
      <div style={{ display: 'absolute', justifyContent: 'flex-end' }}>
        <button style={{ marginRight: 200, backgroundColor: isChatSelected ? 'green' : 'transparent' }} onClick={handleSwitchChange}>Chat</button>
        <button style={{ backgroundColor: isChatSelected ? 'transparent' : 'blue' }} onClick={handleSwitchChange}>Ladder</button>
      </div>
      <div style={selectedOptionStyle}></div>
    </div>
  );
}

export default ChatLadderSwitch;