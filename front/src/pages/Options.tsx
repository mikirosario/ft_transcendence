import React, { useState } from "react";
import UserSettingsButtons from "../components/settings/UserSettingsButtons";
import GoToHomepage from "../components/home/Home";

function Options() {

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
                            <UserSettingsButtons btnTxt="Apply Changes"></UserSettingsButtons>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options;
