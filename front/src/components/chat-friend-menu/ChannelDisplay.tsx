import React, { useState } from 'react';

interface Args {
    image: string;
    name: string;
  }

const ChannelDisplay: React.FC = () => {
    const [username, setUsername] = useState(''); 
	const [userImage, setUserImage] = useState<string>('');

    const FriendWrapper: React.CSSProperties = {
        height: '100vh',
        width: '20vw',
        backgroundColor: 'green',
        top: '0%',
        left: '80%',
        position: 'absolute',
      };

    return (
        <div style={FriendWrapper}>

        </div>
    );

}

export default ChannelDisplay;