import React from 'react';

interface Args {
  image: string;
  name: string;
}

const UserProfile: React.FC<Args> = (args) => {

  const avatarStyle: React.CSSProperties = {
    width: '5vw',
    height: 'auto',
    right: '62%',
    top: '8%',
    position: 'absolute',
    borderRadius: '50%',
  };

  const textWrapper: React.CSSProperties = {
    top: '32%',
    left: '44%',
    position: 'absolute',
    fontFamily: 'Quantico',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5vw',
    maxWidth: '90%',
  }

  return (

    <div >
        <img
          className="avatar"
          src={args.image}
          alt="avatar"
          style={avatarStyle}
        />
        <div style={textWrapper}>
          <div style={textWrapper}>{args.name}</div>
        </div>
    </div>
  );
}

export default UserProfile;