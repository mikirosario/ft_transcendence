import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/PlayButton";
import AuthLoginButton from "../components/home/AuthButton";
import SettingsButton from "../components/home/SettingsButton";
import SwitchChatLadder from "../components/chat-ladder/ChatLadderSwitch";

function Home() {
    const navigate = useNavigate();
    const PlayButtonStyle: React.CSSProperties = {
        transform: 'scale(1.3)',
        position: 'absolute',
        top: '250px',
        left: '250px',
        display: 'flex',
        alignItems: 'flex-end',
    };

    const AuthLoginStyle: React.CSSProperties = {
        position: 'fixed',
        top: '450px',
        left: '150px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '125px',
    };

    const SettingsStyle: React.CSSProperties = {
        position: 'fixed',
        top: '350px',
        left: '310px',
        display: 'flex',
        alignItems: 'flex-end',
        scale: '1.2'
    };

    const SwitchStyle: React.CSSProperties = {
        position: 'fixed',
        top: '100px',
        right: '250px',
        display: 'flex',
        alignItems: 'flex-end',
    };


    const gameSelectorLink = () => {
        navigate('/GameSelector');
    };

    const AuthLoginLink = () => {
        window.location.href = 'XXXXX'; // Auth URL
    };


    return (
        <div>
            <h1> Awesome homepage for a Pong Game </h1>
            <section className="SetingsButton"style={SettingsStyle}>
                <SettingsButton></SettingsButton>
            </section>
            <section className="SwitchChat-Ladder" style={SwitchStyle}>
                <SwitchChatLadder></SwitchChatLadder>
            </section>
            <section className='AuthLoginButton' style={AuthLoginStyle} onClick={AuthLoginLink}>
                <AuthLoginButton></AuthLoginButton>
            </section>
            <section className='PlayButton' style={PlayButtonStyle} onClick={gameSelectorLink}>
                <PlayButton></PlayButton>
            </section>
        </div>
    );
}

export default Home;