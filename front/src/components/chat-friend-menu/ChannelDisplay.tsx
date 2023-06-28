import React, { useState, useEffect } from 'react';
import { MdSend } from 'react-icons/md';
import { createChannel, getChannelList } from '../../requests/Channel.Service';

interface Channel {
  id: number
  name: string
  isPrivate: boolean
}

const ChannelDisplay: React.FC = () => {
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

  const channelListWrapper: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '0%',
    height: '16%',
    width: '100%',
  };

  const friendsListStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '80%',
    textAlign: 'center',
    gap: '75px',
    // overflowY: 'scroll', y ajuste de tamano
  };

  const friendContainerStyle: React.CSSProperties = {
    width: '35%',
    marginBottom: '6%',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    position: 'relative',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
    maxHeight: '50px',
  };

  const nameStyle: React.CSSProperties = {
    width: '85px',
    height: '38px',
    position: 'relative',
    justifyContent: 'flex-start',
    fontSize: '16px',
    color: '#c0c0c0',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '10px',
    flexDirection: 'row',
    transition: 'font-weight 2.5s ease-in-out',
  }

  const handleCreateChannel = async (event: React.FormEvent) => {
    event.preventDefault();

    await createChannel(createChannelName, createChannelPassword);
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
            // onClick={} 
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
      <div style={channelListWrapper}>
        <div style={friendsListStyle}>
          {channelList.map((channel, index) => (
            <button
              key={index}
              style={friendContainerStyle}
              onMouseEnter={() => setIsChannelHovered(index)}
              onMouseLeave={() => setIsChannelHovered(-1)}
            // onClick={() =>}
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
    </div>
  );
}

export default ChannelDisplay;


