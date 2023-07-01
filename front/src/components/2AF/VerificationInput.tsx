import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

interface VerificationInputProps {
  onVerificationResult: (result: boolean) => void;
}

interface VerificationResponse {
  verificationResult: boolean;
}

const VerificationInput: React.FC<VerificationInputProps> = ({ onVerificationResult }) => {
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

  const verify2FA = async () => {
    try {
      const response = await axios.post<VerificationResponse>('http://localhost:3000/auth/second-auth-factor/verify', {
        code: verificationCode,
      });
      console.log(response.data);
      setVerificationResult(response.data.verificationResult);
      onVerificationResult(response.data.verificationResult); // Notify the parent component of the verification result
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    }
  };

  const handleVerificationCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value);
  };

  return (
    <div>
      <input type="text" value={verificationCode} onChange={handleVerificationCodeChange} />
      <button onClick={verify2FA}>Verify 2FA</button>
      {verificationResult !== null && <p>Verification Result: {verificationResult.toString()}</p>}
    </div>
  );
};

export default VerificationInput;
