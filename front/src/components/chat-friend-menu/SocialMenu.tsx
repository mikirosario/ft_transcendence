import React, { useState, useEffect, useContext, useRef } from "react";
import UserProfile from "./ProfileDisplay";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from '../../requests/User.Service';
import FriendDisplay from "./FriendDisplay";
import ChannelDisplay from "./ChannelDisplay"
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa'; // SOLID ARROW
import ChatDisplay from "./ChatDisplay";
import { SocketContext } from '../../SocketContext';
//BiChevronLeft 


function Menu() {
  const socket = useContext(SocketContext);

  const initialIsMenuExpanded = localStorage.getItem("isMenuExpanded") === "true";
  const initialSelectedButton = localStorage.getItem("selectedButton") || 'friend';
  // const initialSelectedChat = localStorage.getItem("selectedChat") ? parseInt(localStorage.getItem("selectedChat")!) : null;

  const [username, setUsername] = useState('');
  const [userImage, setUserImage] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState(initialSelectedButton);
  const [isMenuExpanded, setIsMenuExpanded] = useState(initialIsMenuExpanded);
  const [isFriendChat, setIsFriendChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  const navigate = useNavigate();

  const nickProfileLink = () => {
    navigate('/settings');
  };

  const previousSelectedButton = useRef(selectedButton);  // inicializar la ref

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userProfile = await getUserProfile();
      setUsername(userProfile.username);
      setUserImage(userProfile.userImage);
    };

    if (selectedChat) {
      setSelectedButton('');
    } else if (selectedChat === null && selectedButton === '' && previousSelectedButton.current) {
      setSelectedButton(previousSelectedButton.current);
    }


    fetchUserProfile();
  }, [socket, selectedChat]);

  useEffect(() => {

    if (selectedButton !== '') {
      setSelectedChat(null);
    }
  }, [selectedButton]);


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
    localStorage.setItem("selectedButton", 'friend');
    previousSelectedButton.current = '';
  };

  const handleChannelsButtonClick = () => {
    setSelectedButton('channels');
    localStorage.setItem("selectedButton", 'channels');
    previousSelectedButton.current = '';
  };

  const openChat = (id: number, isFriend: boolean) => {
    if (id !== 0) {
      previousSelectedButton.current = selectedButton;
    }
    setSelectedChat(id !== 0 ? id : null);
    setIsFriendChat(isFriend);
  };

  return (
    <>
      <button
        style={toggleButtonStyle}
        onClick={() => {
          setIsMenuExpanded(!isMenuExpanded);
          localStorage.setItem("isMenuExpanded", (!isMenuExpanded).toString());
        }}
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
              <ChatDisplay selectedChat={selectedChat} setSelectedChat={setSelectedChat} isFriendChat={isFriendChat} />
            ) : (
              selectedButton === 'friend' ? <FriendDisplay openChat={(id) => openChat(id, true)} /> : <ChannelDisplay openChat={(id) => openChat(id, false)} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
