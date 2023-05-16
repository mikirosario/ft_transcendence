import React from "react";
import OptionsButton from "../components/settings/SettingsButtons";
import GoToHomepage from "../components/home/Home";

function Options() {

    const NicknamePositionStyle: React.CSSProperties = {
        height: '320px',
        width: '100%',
        top: '320px',
        backgroundColor: '#01624',
    };

    const NicknameTapeStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        top: '260px',
        backgroundColor: '#1c2c49',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
    };

    const NicknameInputStyle: React.CSSProperties = {
        height: '74px',
        left: '50%',
        position: 'absolute',
        top: '220px',
        width: '80%',
        maxWidth: '300px',
        transform: 'translateX(-50%)',
    };



    return (
        <div className="Homepage">
            <section>
                <GoToHomepage></GoToHomepage>
            </section>
            <div className="NicknamePositionWrapper" style={NicknamePositionStyle}>
                <div className="NicknameTapeWrapper" style={NicknameTapeStyle}>
                    <div className="NicknameInputWrapper" style={NicknameInputStyle}>
                        <section className="OptionsMenu">
                            <OptionsButton></OptionsButton>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Options;