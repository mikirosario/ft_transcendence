import React, { useState } from 'react';
import HomeButton from "../components/B_Home";
import OriginalMenu from "../components/gameSelector/M_OriginalGame";
import CustomMenu from "../components/gameSelector/M_CustomGame";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";

function GameSelector() {
    const [isCustom, setIsCustom] = useState(false);

    //<<< STYLES >>>//
    const BodyStyle: React.CSSProperties = {
        display: 'flex',
        height: '100vh',
    }

    const Content: React.CSSProperties = {
        flex: '1',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const Box: React.CSSProperties = {
        width: '940px',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '15px',
        backgroundColor: '#4C5970',
    }

    const ButtonHeader: React.CSSProperties = {
        width: '100%',
        height: '100px',
        display: 'flex',
    }

    const Button: React.CSSProperties = {
        width: '50%',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        fontFamily: "'Press Start 2P'",
        color: 'white',
        background: isCustom
            ? 'rgba(0,0,0,0.2)'
            : 'rgba(0,0,0,0)',
    }

    const ButtonAlt: React.CSSProperties = {
        width: '50%',
        height: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        fontFamily: "'Press Start 2P'",
        color: 'white',
        background: isCustom
            ? 'rgba(0,0,0,0)'
            : 'rgba(0,0,0,0.2)',
    }

    const SectionStyle: React.CSSProperties = {
        flex: 1,
        display: isCustom
            ? 'none'
            : 'flex',
    }

    const SectionAlt: React.CSSProperties = {
        flex: 1,
        display: isCustom
            ? 'flex'
            : 'none',
    }


    //<<< FUNCTIONS >>>//
    const changeCustom = () => {
        if (isCustom === true)
            setIsCustom(false);
    }

    const changeOriginal = () => {
        if (isCustom === false)
            setIsCustom(true);
    }


    //<<< BUILD >>>//
    return (
        <div style={BodyStyle}>
            <div style={Content}>
                <HomeButton></HomeButton>
                <div style={Box}>
                    <div className='ButtonHeader' style={ButtonHeader}>
                        <div className='OriginalButton' style={Button} onClick={changeCustom}>ORIGINAL</div>
                        <div className='CustomButton' style={ButtonAlt} onClick={changeOriginal}>CUSTOM</div>
                    </div>
                    <div className='OriginalContent' style={SectionStyle}>
                        <OriginalMenu></OriginalMenu>
                    </div>
                    <div className='CustomContent' style={SectionAlt}>
                        <CustomMenu></CustomMenu>
                    </div>
                </div>
            </div>
            <SocialMenu></SocialMenu>
        </div>
    );
}

export default GameSelector;