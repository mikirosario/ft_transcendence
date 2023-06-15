import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../../requests/User.Service';



const FriendDisplay: React.FC = () => {
    const [username, setUsername] = useState(''); 
	const [userImage, setUserImage] = useState<string>('');

	useEffect(() => {
		const fetchUserProfile = async () => {
			const userProfile = await getUserProfile();
			setUsername(userProfile.username);
			setUserImage(userProfile.userImage);
		  };
		  
		  fetchUserProfile();
	}, []);

    const FriendWrapper: React.CSSProperties = {
        height: '100vh',
        width: '20vw',
        backgroundColor: 'purple',
        top: '0%',
        left: '80%',
        position: 'absolute',
      };

    const avatarStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        left: '15%',
        top: '5%',
        position: 'relative',
        borderRadius: '50%',
        objectFit: 'cover',
    }

    const nameStyle: React.CSSProperties = {
        left: '35%',
        bottom: '1.5%',
        position: 'relative'
    }

    return (
        <div style={FriendWrapper}>
          <img
            className='FriendAvatar'
            src={userImage}
            style={avatarStyle}
            />
            <p style={nameStyle}>{username}</p>
        </div>
    );

}

export default FriendDisplay;