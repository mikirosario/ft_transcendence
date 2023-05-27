import React, { useState, useEffect } from "react";
import UserProfile from "./ProfileDisplay";
import DefaultIMG from "../../assets/images/default.jpg"
import { useNavigate } from "react-router-dom";
import { getUserProfile } from '../../requests/User.Service';

function Menu() {
  const [username, setUsername] = useState('');
	const [userImage, setUserImage] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState('');
  const navigate = useNavigate();

  const nickProfileLink = () => {
    navigate('/settings');
  };

  useEffect(() => {
		const fetchUserProfile = async () => {
			const userProfile = await getUserProfile();
			setUsername(userProfile.username);
			setUserImage(userProfile.userImage);
		  };
		  
		  fetchUserProfile();
	}, []);



  const MenuStyle: React.CSSProperties = {
    height: '100vh',
    width: '20vw',
    backgroundColor: '#1C2C4A',
    top: '0%',
    left: '80%',
    position: 'absolute',
  };

  const ProfileButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    height: '12%',
    width: '75%',
    top: '4%',
    left: '12%',
    position: 'absolute',
    cursor: 'pointer',
    borderRadius: '25%',
  };

  const FriendButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    fontFamily: 'Quantico',
    fontSize: '1vw',
    height: '5vh',
    width: '50%',
    top: '18%',
    left: '0%',
    position: 'absolute',
    cursor: 'pointer',
    minBlockSize: '25px',
    borderBottom: selectedButton === 'friend' ? '3px solid #D4D4D4' : '3px double black',
    color: selectedButton === 'friend' ? '#FFFFFF' : '#D4D4D4',
    textShadow: selectedButton === 'friend' ? '0.6px 0 0 black' : 'none',
  };

  const ChannelsButtonStyle: React.CSSProperties = {
    border: 'none',
    background: 'none',
    fontFamily: 'Quantico',
    fontSize: '1vw',
    height: '5vh',
    width: '50%',
    top: '18%',
    left: '50%',
    position: 'absolute',
    cursor: 'pointer',
    minBlockSize: '25px',
    borderBottom: selectedButton === 'channels' ? '3px solid #D4D4D4' : '3px double black',
    color: selectedButton === 'channels' ? '#FFFFFF' : '#D4D4D4',
    textShadow: selectedButton === 'channels' ? '0.6px 0 0 black' : 'none',
  };

  const handleFriendButtonClick = () => {
    setSelectedButton('friend');
  };

  const handleChannelsButtonClick = () => {
    setSelectedButton('channels');
  };


  // image tiene que ser del request

  return (
    <div style={MenuStyle}>
      <button style={ProfileButtonStyle} onClick={nickProfileLink}>
        <UserProfile image={userImage} name={username}></UserProfile>
      </button>
      <button style={FriendButtonStyle} onClick={handleFriendButtonClick}>
        Amigos
      </button>
      <button style={ChannelsButtonStyle} onClick={handleChannelsButtonClick}>
        Canales
      </button>
    </div>
  );
}

export default Menu;
