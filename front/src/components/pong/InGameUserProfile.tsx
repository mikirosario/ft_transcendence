import React from 'react';

interface Args {
  image: string;
  name: string;
  rank: number;
  // level: number;
}

const InGameUserProfile: React.FC<Args> = (args) => {
  return (
    <div>
      <img
        className="avatar"
        src={args.image}
        alt="avatar"
        style={{
          width: 75,
          height: 75,
          borderRadius: '50%',
          marginRight: 15
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ fontSize: 16 }}>{args.name} <span style={{ fontSize: 13, fontWeight: 'bold' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#{args.rank}</span></div>
        {/* <div style={{ fontSize: 13, marginTop: 2}}>Nivel: {props.level}</div> */}
      </div>
    </div>
  );
}

export default InGameUserProfile;