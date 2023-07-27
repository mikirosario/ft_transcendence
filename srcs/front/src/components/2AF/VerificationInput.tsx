import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { getServerIP } from '../../utils/utils';

interface VerificationInputProps {
  onVerificationPassed: (result: boolean) => void;
}

interface VerificationResponse {
  verificationResult: boolean;
}

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const VerificationInput: React.FC<VerificationInputProps> = ({ onVerificationPassed }) => {
  const [verificationCode, setVerificationCode] = useState<string>('');

  const verify2FA = async () => {
    try {
      const response = await axios.post<VerificationResponse>(getServerIP(3000) + 'auth/second-auth-factor/verify', {code: verificationCode}, {
        responseType: 'json',
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        }
      });
      console.log(response.data);
      onVerificationPassed(response.data.verificationResult);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    }
  };

  const handleVerificationCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };

  const SecondFactorButtonSytle: React.CSSProperties = {
    backgroundColor: '#5b8731',
    color: '#FFFFFF',
    fontFamily: "'Press Start 2P'",
    fontSize: '15px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    cursor: 'pointer',
    width: '200px',
    marginLeft: '3%',
    transition: 'opacity 0.3s',
  };
  
  const SecondFactorInputStyle: React.CSSProperties = {
    color: 'white',
    fontFamily: "'Press Start 2P'",
    fontSize: '15px',
    padding: '5px 10px',
    width: '240px',
    border: 'none',
    borderBottom: '2px solid gray',
    background: 'transparent',
  };
  
  const ContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };
  
  return (
    <div style={ContainerStyle}>
      <input  style={SecondFactorInputStyle} type="text" value={verificationCode} onChange={handleVerificationCodeChange} />
      <button style={SecondFactorButtonSytle} onClick={verify2FA}>Verify 2FA</button>
    </div>
  );
};

export default VerificationInput;
