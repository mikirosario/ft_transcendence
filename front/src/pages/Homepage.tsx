import React from "react";
import { useNavigate } from 'react-router-dom';
import SettingsButton from "../components/home/SettingsButton";
import HomeButton from "../components/B_Home";
import GameButton from "../components/B_General";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";

function Home() {
    const navigate = useNavigate();

    const Window: React.CSSProperties = {
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
    }
    
    const WindowSocial: React.CSSProperties = {
        width: '400px',
        height: '100%',
        backgroundColor: '#1C2C4A',
    }

    const PlayFriendsButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '250px',
        left: '600px',
        display: 'flex',
        alignItems: 'flex-end',
    };

    const PlayButtonStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '250px',
        left: '600px',
        display: 'flex',
        alignItems: 'flex-end',
    };


    const SettingsStyle: React.CSSProperties = {
        position: 'fixed',
        top: '30px',
        right: '30px',
        display: 'flex',
        alignItems: 'flex-end',
        scale: '1.5'
    };


    const GoGamePong = () => {
        navigate('/pong');
    };

    // const acceptFriendRequest = async (event: React.FormEvent) =>  {
    //     event.preventDefault();
        
    //     await deleteFriend('kepa');
    // }

    const GoGameSelector = () => {
        navigate('/gameSelector');
    };

    return (
        <div style={Window}>
            <div>
                <HomeButton></HomeButton>
                <section className="B_PFriends" style={PlayFriendsButtonStyle} onClick={GoGamePong}>
                    <GameButton name="Play with friends" width={435} height={155} fsize={22}></GameButton>
                </section>
                <section className="B_Play" style={PlayButtonStyle} onClick={GoGameSelector}>
                    <GameButton name="Play" width={435} height={155} fsize={48}></GameButton>
                </section>
                <section>
                    <SocialMenu></SocialMenu>
                </section>
            </div>
        </div>
    );
}

export default Home;
