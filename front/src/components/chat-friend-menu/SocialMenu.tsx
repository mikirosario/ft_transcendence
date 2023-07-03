import React, { useState, useEffect } from "react";
import UserProfile from "./ProfileDisplay";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from '../../requests/User.Service';
import FriendDisplay from "./FriendDisplay";
import ChannelDisplay from "./ChannelDisplay"
import { io, Socket } from 'socket.io-client';
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa'; // SOLID ARROW
import ChatDisplay from "./ChatDisplay";
//BiChevronLeft 

const socketOptions = {
  transportOptions: {
    polling: {
      extraHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem("token"),
      }
    }
  }
};

const socket: Socket = io('http://localhost:8083/', socketOptions);

function Menu() {
  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState('friend');
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);

  const [selectedChat, setSelectedChat] = useState<string | null>(null);

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

    socket.on("receiveMessages", (data) => {
      console.log(data);
    });

  }, []);


  const MenuStyle: React.CSSProperties = {
    height: '100vh',
    width: '20vw',
    backgroundColor: '#1C2C4A',
    top: '0%',
    left: '80%',
    position: 'absolute',
    transition: 'width 0.5s ease, left 0.5s ease',
    overflow: 'hidden',
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

  const SocialDisplay: React.CSSProperties = {
    width: '0%',
    height: '77%',
    backgroundColor: 'grey',
    top: '23.09%',
    left: '0%',
    position: 'absolute',
  };

  const toggleButtonStyle: React.CSSProperties = isMenuExpanded
    ? {
      position: 'absolute',
      top: '30px',
      right: '20vw',
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      padding: '6px',
      transition: 'right 0.5s ease',
    } : {
      position: 'absolute',
      top: '30px',
      right: '0',
      backgroundColor: 'transparent',
      color: 'white',
      border: 'none',
      padding: '6px',
      transition: 'right 0.5s ease',
    };

  const handleFriendButtonClick = () => {
    setSelectedButton('friend');

  };

  const handleChannelsButtonClick = () => {
    setSelectedButton('channels');
  };

  const openChat = async (chat: string) => {
    // create chat window
    // await createFriendChat(friendName);
    setSelectedChat(chat);  // Actualiza el estado chatSelected (puede ser un canal o un amigo)
  }


  return (
    <>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsMenuExpanded(!isMenuExpanded)}
      >
        {isMenuExpanded ? <FaAngleRight size={22} /> : <FaAngleLeft size={22} />}
      </button>

      <div style={{
        ...MenuStyle,
        width: isMenuExpanded ? '20vw' : '0',
        left: isMenuExpanded ? '80%' : '100%',
      }}>
        <button style={ProfileButtonStyle} onClick={nickProfileLink}>
          <UserProfile image={userImage} name={username}></UserProfile>
        </button>
        <div>
          <button style={FriendButtonStyle} onClick={handleFriendButtonClick}>
            Amigos
          </button>
          <button style={ChannelsButtonStyle} onClick={handleChannelsButtonClick}>
            Canales
          </button>
          <div style={SocialDisplay}>
            {selectedChat ? (
              <ChatDisplay selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
            ) : (
              selectedButton === 'friend' ? <FriendDisplay openChat={openChat} /> : <ChannelDisplay openChat={openChat} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
