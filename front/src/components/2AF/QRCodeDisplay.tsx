import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QRCodeDisplay: React.FC = () => {
  const [qrCodeImage, setQRCodeImage] = useState<string>('');

  useEffect(() => {
      const enable2FA = async () => {
        try {
          const response = await axios.get<string>('http://localhost:3000/auth/second-auth-factor/enable');
          setQRCodeImage(response.data);
          console.log(response.data);
        } catch (error) {
          console.error('Error enabling 2FA:', error);
        }
      };
      enable2FA();
  }, []);

  return (
    <div>
      <img src={qrCodeImage} />
    </div>
  );
};

export default QRCodeDisplay;