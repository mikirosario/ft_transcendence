import React, { useState } from "react";
import UserSettingsButtons from "../components/settings/UserSettingsButtons";
import GoToHomepage from "../components/home/Home";
import axios from 'axios';

function Options() {
    const [is2FAActivated, setIs2FAActivated] = useState(false);


    const activate2FA = async () => {
        setIs2FAActivated(true);
        /*
        try {
          const response = await axios.post("http://localhost:3000/auth/second-auth-factor/enable");
    
          if (response.status === 200) {
            const { secretKey, otpAuthUrl } = response.data;
            // Here, you can handle the secret key and OTP auth URL as needed
            // You can display the QR code or provide instructions for the user to set up 2FA
            setIs2FAActivated(true);
          } else {
            // Handle the error response from the server
            console.error("Failed to enable 2FA");
          }
        } catch (error) {
          // Handle any network or other errors
          console.error("An error occurred while enabling 2FA", error);
        }*/
      };

    const remove2FA = () => {
        setIs2FAActivated(false);
    }

    const NicknamePositionStyle: React.CSSProperties = {
        height: '320px',
        width: '100%',
        top: '320px',
        backgroundColor: '#01624',
    };

    const NicknameTapeStyle: React.CSSProperties = {
        height: '150%',
        width: '100%',
        top: '50%',
        backgroundColor: '#1c2c49',
        position: 'relative',
    };

    const TitleStyle: React.CSSProperties = {
        color: '#ffffff',
        fontFamily: "'Press Start 2P'",
        fontSize: '40px',
        top: '-25%',
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        left: '0%',
    };

    const NicknameInputStyle: React.CSSProperties = {
        height: '66%',
        width: '40%',
        top: '32%',
        left: '28%',
        position: 'absolute',
    };


    return (
        <div className="Register">
            <section>
                <GoToHomepage></GoToHomepage>
            </section>
            <div className="NicknamePositionWrapper" style={NicknamePositionStyle}>
                <div className="NicknameTapeWrapper" style={NicknameTapeStyle}>
                    <div className="NicknameInputWrapper" style={NicknameInputStyle}>
                        <div className="TitleText" style={TitleStyle}>
                            Edit Profile
                        </div>
                        <section className="OptionsMenu">
                        {!is2FAActivated && ( <button onClick={activate2FA}>Activate 2FA</button> )}
                        {is2FAActivated && ( <button onClick={remove2FA}>Remove 2FA</button> )}
                            <UserSettingsButtons btnTxt="Apply Changes"></UserSettingsButtons>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options;
