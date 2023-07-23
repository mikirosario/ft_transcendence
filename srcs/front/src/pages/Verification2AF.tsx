import React from 'react';
import VerificationInput from '../components/2AF/VerificationInput';

function Verification2af() {
  const handleVerificationResult = (result : boolean) => {
    console.log('Verification Result:', result);
  };

  return (
    <div>
      <h1>Verification 2AF</h1>
      <VerificationInput onVerificationResult={handleVerificationResult} />
    </div>
  );
}

export default Verification2af;
