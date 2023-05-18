import React from "react";
import UserSettingsButtons from "../components/settings/UserSettingsButtons";

function Register() {

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

    return (
        <div className="NicknamePositionWrapper" style={NicknamePositionStyle}>
            <div className="NicknameTapeWrapper" style={NicknameTapeStyle}>
                <div className="NicknameTitle" style={TitleStyle}>
                    CHOOSE A NICKNAME
                </div>
                <div className="NicknameSubtitle" style={SubtitleStyle}>
                    Nick rules
                </div>
                <div className="NicknameInputWrapper" style={NicknameInputStyle}>
                    <section className="OptionsMenu">
                        <UserSettingsButtons btnTxt="Register"></UserSettingsButtons>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default Register;