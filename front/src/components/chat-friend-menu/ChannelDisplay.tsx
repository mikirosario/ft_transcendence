import React, { useState, useEffect, useContext } from 'react';
import { MdSend } from 'react-icons/md';
import { createChannel, getChannelList, joinChannel } from '../../requests/Channel.Service';
// import { SocketContext } from '../../SocketContext';

interface Channel {
  id: number
  name: string
  isPrivate: boolean
}

function ChannelDisplay({ openChat }: { openChat: (friendName: number) => void }) {
  // const socket = useContext(SocketContext);

  const [channelList, setChannelList] = useState<Channel[]>([]);

  const [createChannelName, setCreateChannelName] = useState('');
  const [createChannelPassword, setCreateChannelPassword] = useState('');
  const [joinChannelName, setJoinChannelName] = useState('');
  const [JoinChannelPassword, setJoinChannelPassword] = useState('');

  const [isChannelHovered, setIsChannelHovered] = useState(-1);

  const [isHoveredCreate, setIsHoveredCreate] = useState(false);
  const [isHoveredJoin, setIsHoveredJoin] = useState(false);

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannelList();
      setChannelList(channels);
    };

    fetchChannels();
  }, []);

  // ------------------- BUTTON CHANNELS STYLES ------------------------------

  const ChannelWrapper: React.CSSProperties = {
    height: '100vh',
    width: '20vw',
    top: '0%',
    left: '80%',
    position: 'absolute',
  }

  const CreateChannelButtonWrapper: React.CSSProperties = {
    top: '2%',
    left: '20%',
    width: '60%',
    height: isHoveredCreate ? '95px' : '40px',
    position: 'relative',
    flexDirection: 'column',
    transition: 'height 0.3s ease-in-out',
    display: 'flex',
  }

  const addFriendButtonStyle: React.CSSProperties = {
    width: '100%',
    borderRadius: '12px',
    border: 'none',
    position: "relative",
    textAlign: "center",
  }

  const InputDivStyle: React.CSSProperties = {
    width: '100%',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
    borderRadius: '12px',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '40px',
  }

  const InputStyle: React.CSSProperties = {
    border: 'none',
    fontFamily: "'Press Start 2P'",
    fontSize: '12px',
    height: '22px',
    width: '150px',
    background: 'transparent',
    textAlign: 'center',
    borderBottom: isHoveredCreate ? '2px solid black' : 'none',
    position: 'relative',
    left: '8px',
  }

  const SendIconStyle: React.CSSProperties = {
    marginLeft: '15px',
    cursor: 'pointer'
  }

  const CreateChannelButtonWrapper2: React.CSSProperties = {
    ...CreateChannelButtonWrapper,
    top: '3%',
    height: isHoveredJoin ? '95px' : '40px',
  }

  const PasswordDivStyle: React.CSSProperties = {
    ...InputDivStyle,
    marginTop: '10px',
    height: isHoveredCreate ? '40px' : '0px',
    overflow: isHoveredCreate ? 'visible' : 'hidden',
    transition: 'height 0.3s ease-in-out'
  }

  const PasswordInputStyle: React.CSSProperties = {
    ...InputStyle,
    borderBottom: '2px solid black',
    marginLeft: '-32px',
    visibility: isHoveredCreate ? 'visible' : 'hidden',
  }

  const InputStyleCreate: React.CSSProperties = {
    ...InputStyle,
    fontSize: isHoveredCreate ? '12px' : '11px',
    borderBottom: isHoveredCreate ? '2px solid black' : 'none',
  }

  const PasswordDivStyleCreate: React.CSSProperties = {
    ...PasswordDivStyle,
    height: isHoveredCreate ? '40px' : '0px',
    overflow: isHoveredCreate ? 'visible' : 'hidden',
  }

  const PasswordInputStyleCreate: React.CSSProperties = {
    ...PasswordInputStyle,
    visibility: isHoveredCreate ? 'visible' : 'hidden',
  }

  const InputStyleJoin: React.CSSProperties = {
    ...InputStyle,
    fontSize: isHoveredJoin ? '12px' : '11px',
    borderBottom: isHoveredJoin ? '2px solid black' : 'none',
  }

  const PasswordDivStyleJoin: React.CSSProperties = {
    ...PasswordDivStyle,
    height: isHoveredJoin ? '40px' : '0px',
    overflow: isHoveredJoin ? 'visible' : 'hidden',
  }

  const PasswordInputStyleJoin: React.CSSProperties = {
    ...PasswordInputStyle,
    visibility: isHoveredJoin ? 'visible' : 'hidden',
  }

  // ------------------- CHANNELS LIST STYLES ------------------------------

  const friendsListStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'start',
    width: '100%',
    height: '64.5%',
    marginTop: '7.5%',
    textAlign: 'center',
    overflowY: 'auto',
    background: 'transparent'
  };

  const friendContainerStyle: React.CSSProperties = {
    left: '12.5%',
    top: '10px',
    width: '38%',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    position: 'relative',
    cursor: 'pointer',
    // transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
    maxHeight: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    scale: '0.9',
  };

  const nameStyle: React.CSSProperties = {
    fontSize: '16px',
    fontFamily: 'Quantico',
    color: '#c0c0c0',
  }

  const handleCreateChannel = async (event: React.FormEvent) => {
    event.preventDefault();

    await createChannel(createChannelName, createChannelPassword);
    setCreateChannelName('');
    setCreateChannelPassword('');
  }

  const handleJoinChannel = async (event: React.FormEvent) => {
    event.preventDefault();

    await joinChannel(joinChannelName, JoinChannelPassword);
    setCreateChannelName('');
    setCreateChannelPassword('');
  }

  return (
    <div style={ChannelWrapper}>
      <div style={CreateChannelButtonWrapper}
        onMouseEnter={() => setIsHoveredCreate(true)}
        onMouseLeave={() => setIsHoveredCreate(false)}
      >
        <div style={addFriendButtonStyle}>
          <div style={InputDivStyle}>
            {isHoveredCreate ? (
              <input type='text'
                value={createChannelName}
                onChange={e => setCreateChannelName(e.target.value)}
                placeholder='Canal'
                maxLength={10}
                style={InputStyleCreate}
              />
            ) : (
              <p style={{ fontFamily: "'Press Start 2P'", fontSize: '11px' }}>Crear Canal</p>
            )}
            {isHoveredCreate && <MdSend size={20} style={SendIconStyle}
              onClick={handleCreateChannel}
            />}
          </div>

          <div style={PasswordDivStyleCreate}>
            <input type='password'
              value={createChannelPassword}
              onChange={e => setCreateChannelPassword(e.target.value)}
              placeholder='Contraseña'
              maxLength={10}
              style={PasswordInputStyleCreate}
            />
          </div>
        </div>
      </div>

      <div style={CreateChannelButtonWrapper2}
        onMouseEnter={() => setIsHoveredJoin(true)}
        onMouseLeave={() => setIsHoveredJoin(false)}
      >
        <div style={addFriendButtonStyle}>
          <div style={InputDivStyle}>
            {isHoveredJoin ? (
              <input type='text'
                value={joinChannelName}
                onChange={e => setJoinChannelName(e.target.value)}
                placeholder='Canal'
                maxLength={10}
                style={InputStyleJoin}
              />
            ) : (
              <p style={{ fontFamily: "'Press Start 2P'", fontSize: '11px' }}>Unirse Canal</p>
            )}
            {isHoveredJoin && <MdSend size={20} style={SendIconStyle}
              onClick={handleJoinChannel}
            />}
          </div>

          <div style={PasswordDivStyleJoin}>
            <input type='password'
              value={JoinChannelPassword}
              onChange={e => setJoinChannelPassword(e.target.value)}
              placeholder='Contraseña'
              maxLength={10}
              style={PasswordInputStyleJoin}
            />
          </div>
        </div>
      </div>
      {/* Channel List */}
      <div style={friendsListStyle}>
        {channelList.map((channel, index) => (
          <button
            key={index}
            style={friendContainerStyle}
            onMouseEnter={() => setIsChannelHovered(index)}
            onMouseLeave={() => setIsChannelHovered(-1)}
            onClick={() => openChat(channel.id)}
          >
            <div style={{
              transform: isChannelHovered === index ? 'scale(1.1)' : 'none',
              transition: 'transform 0.3s ease-in-out',
            }}>

              <p style={{
                ...nameStyle,
                fontWeight: isChannelHovered === index ? 'bold' : 'normal'
              }}>
                {channel.isPrivate ? '🔒' : '🌐'}
                {channel.name}
              </p>
            </div>

          </button>
        ))}
      </div>
    </div>
  );
}

export default ChannelDisplay;


