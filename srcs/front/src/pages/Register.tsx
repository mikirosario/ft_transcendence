import React, { useEffect, useState } from "react";
import UserSettingsButtons from "../components/settings/UserSettingsButtons";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { get2FAuthUser } from "../requests/User.Service";
import VerificationInput from '../components/2AF/VerificationInput';

function Register() {
  const [ready, setReady] = useState(false);
  const [secondFactor, setSecondFactor] = useState(false);
  const [verificationPassed, setVerificationPassed] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {   
    if (!verificationPassed)  // SI NO PONE CODIGO 2FA Y HACE F5 HACE SKIP
    navigate('/register');
  
  }, [verificationPassed]);
  
  useEffect(() => {
    if (searchParams.has("token")) {
      const token = searchParams.get("token");
      if (token) {
        localStorage.setItem('token', token);
        searchParams.delete("token");
        setSearchParams(searchParams);
        setReady(true);
      }
    } else {
      setReady(true);
    }
  }, [searchParams, setSearchParams]);


  useEffect(() => {
    const check2AFOnLoad = async () => {
      setSecondFactor(await get2FAuthUser());
    };

    check2AFOnLoad();
  }, []);

  const NicknamePositionStyle: React.CSSProperties = {
    height: '320px',
    width: '100%',
    top: '320px',
    backgroundColor: '#01624',
  };

  const NicknameTapeStyle: React.CSSProperties = {
    height: '170%',
    width: '100%',
    top: '50%',
    backgroundColor: '#1c2c49',
    position: 'relative',
  };

  const TitleStyle: React.CSSProperties = {
    color: '#ffffff',
    fontFamily: "'Press Start 2P'",
    fontSize: '40px',
    top: '8%',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    left: '0%',
  };

  const SubtitleStyle: React.CSSProperties = {
    color: '#ffffff',
    fontFamily: "'Press Start 2P'",
    fontSize: '20px',
    top: '22%',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
    left: '0%',

  };

  const NicknameInputStyle: React.CSSProperties = {
    height: '58%',
    width: '40%',
    left: '28%',
    top: '40%',
    position: 'relative',
  };

  const TitleSecondFactorSyle: React.CSSProperties = {
    paddingLeft: '30%',
    paddingTop: '10%',
    color: 'gray',
    fontFamily: "'Press Start 2P'"
  };
  
  const SecondFactorSyle: React.CSSProperties = {
    paddingLeft: '43.5%',
  };

  return (
    ready
      ? (
        <div style={NicknamePositionStyle}>
          <div style={NicknameTapeStyle}>
            {secondFactor && !verificationPassed
              ? <div>
                <h1 style={TitleSecondFactorSyle}>Introduce el codigo de 2FA</h1>
                <div style={SecondFactorSyle}>
                  <VerificationInput onVerificationPassed={setVerificationPassed} />
                </div>
              </div>
              : (
                <>
                  <div style={TitleStyle}>CHOOSE A NICKNAME</div>
                  <div style={SubtitleStyle}>Nick rules</div>
                  <div style={NicknameInputStyle}>
                    <section>
                      <UserSettingsButtons btnTxt="Register"></UserSettingsButtons>
                    </section>
                  </div>
                </>
              )
            }
          </div>
        </div>
      )
      : <div>Loading...</div>
  );
}

export default Register;
