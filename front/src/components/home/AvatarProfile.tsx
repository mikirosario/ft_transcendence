import React from 'react';

interface Args {
  image: string;
  name: string;
  rank: number;
  // level: number;
}

const InGameUserProfile: React.FC<Args> = (args) => {
  const avatarStyle = {
    width: 75,
    height: 75,
    borderRadius: '50%',
    marginRight: 15
  };

  const nameStyle = {
    fontSize: 16
  };

  const rankStyle = {
    fontSize: 13,
    fontWeight: 'bold'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        className="avatar"
        src={args.image}
        alt="avatar"
        style={avatarStyle}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={nameStyle}>{args.name}</div>
        <div style={rankStyle}>#{args.rank}</div>
      </div>
    </div>
  );
}

export default InGameUserProfile;