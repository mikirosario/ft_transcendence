import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthLoginButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('XXXXX'); // Replace 'XXXXX' with the desired URL
  };

  const buttonStyle = {
    backgroundColor: 'rgb(0, 149, 150)',
    color: 'white',
    borderRadius: '5px',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div>
      <button style={buttonStyle} onClick={handleClick}>
        Auth Login
      </button>
    </div>
  );
};

export default AuthLoginButton;
