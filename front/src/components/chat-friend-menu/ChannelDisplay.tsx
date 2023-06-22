import React, { useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';

interface Args {
  id: number;
  name: string;
  pwd?: string;
}

const ChannelDisplay: React.FC = () => {
  const [channelName, setChannelName] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [isPasswordHovered, setIsPasswordHovered] = useState(false);

  useEffect(() => {

  }, []);

  const ChannelsWrapper: React.CSSProperties = {
    height: '100vh',
    width: '20vw',
    // backgroundColor: 'green',
    top: '0%',
    left: '80%',
    position: 'absolute',
  };

  const createChannelButtonWrapper: React.CSSProperties = {
    top: '2%',
    left: '20%',
    width: '60%',
    height: isPasswordHovered ? '120px' : '40px',
    position: "relative",
    // backgroundColor: 'green',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    overflow: 'hidden',
    transition: 'height 0.3s',
  };

  const createChannelButtonStyle: React.CSSProperties = {
    width: "100%",
    height: '40px',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
    borderRadius: '12px',
    border: 'none',
    fontFamily: "'Press Start 2P'",
    fontSize: "11px",
    position: "relative",
    textAlign: "center",
    opacity: 1,
  };

  const createChannelInputWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s',
  };

  const createChannelPWDInputWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.3s',
    marginTop: '12px'
  };

  const createChannelInputTextStyle: React.CSSProperties = {
    border: 'none',
    fontFamily: "'Press Start 2P'",
    fontSize: "12px",
    height: '40px',
    width: "150px",
    background: 'transparent',
    textAlign: 'center',
    borderBottom: '2px solid black',
    flexGrow: 1,  // Esto hace que el input tome todo el espacio horizontal disponible
  };

  const createChannelInputTextSendStyle: React.CSSProperties = {
    marginLeft: '12px',
    cursor: 'pointer'
  }

  const createChannelPasswordInputWrapperStyle: React.CSSProperties = {
    ...createChannelInputWrapperStyle,
    opacity: isPasswordHovered ? 1 : 0,
  };
  const handleCreateChannelRequest = async (event: React.FormEvent) => {
    event.preventDefault();

    // await createChannel(channelName);
  }


  return (
    <div style={ChannelsWrapper}>
      <div
        style={createChannelButtonWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseOver={() => setIsPasswordHovered(true)}
        onMouseOut={() => setIsPasswordHovered(false)}
      >
        {!isHovered && (
          <button style={createChannelButtonStyle}>
            Crear Canal
          </button>
        )}

{/* isHovered && */}
        {isHovered && (
          <>
            <div style={createChannelInputWrapperStyle}>
              <input style={createChannelInputTextStyle}
                type="text"
                value={channelName}
                placeholder='Canal'
                onChange={(e) => setChannelName(e.target.value)}
                maxLength={10} />
              <MdSend style={createChannelInputTextSendStyle} size={20} />
            </div>
            <div style={createChannelPWDInputWrapperStyle}>
              <input style={createChannelInputTextStyle}
                type="password"
                value={password}
                placeholder='Contraseña'
                onChange={(e) => setPassword(e.target.value)}
                maxLength={10} />
              <MdSend style={createChannelInputTextSendStyle} size={20} />
            </div>
          </>
        )}
      </div>
    </div>
  );

}

export default ChannelDisplay;