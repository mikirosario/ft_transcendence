import React, { useState } from "react";
import UserSettingsButtons from "../components/settings/UserSettingsButtons";
import GoToHomepage from "../components/home/Home";
import QRCodeDisplay from "../components/2AF/QRCodeDisplay";
import VerificationInput from "../components/2AF/VerificationInput";
//import axios from 'axios';

function Options() {
    const [is2AFActive, setIs2AFACtive] = useState(false);

    const handleToggle2AF = () =>{
        setIs2AFACtive(!is2AFActive);
    };
  
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
                            {is2AFActive && <QRCodeDisplay/>}
                            <button onClick={handleToggle2AF}>
                                {is2AFActive ? "Deactivate 2AF" : "Activate 2AF"}
                            </button>
                            <UserSettingsButtons btnTxt="Apply Changes"></UserSettingsButtons>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options;
