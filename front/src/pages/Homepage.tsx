import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/StartButton";
import SettingsButton from "../components/home/SettingsButton";
import GoToHomepage from "../components/home/Home";
import Menu from "../components/chat-friend-menu/Menu";

function Home() {
    const navigate = useNavigate();

    const HomeStatic: React.CSSProperties = {
        width: '100%', /* set the width of the container to 100% of the parent */
        height: '100%',/* set the height of the container to 100% of the parent */
        overflow: 'auto', /* allows content to overflow and makes the scrollbars appear */
    };

    const HomeStatic2: React.CSSProperties = {
        width: '1000px', /* or any other specific size you want */
        height: '50%', /* or any other specific size you want */
    };

    const PlayButtonStyle: React.CSSProperties = {
        transform: 'scale(1.3)',
        position: 'absolute',
        top: '30%',
        left: '42%',
    };


    const SettingsStyle: React.CSSProperties = {
        position: 'absolute',
        top: '45%',
        left: '45%',
        scale: '1.2'
    };

    const gameSelectorLink = () => {
        navigate('/pong');
    };

    return (
        <div style={HomeStatic}>
            <div style={HomeStatic2}>
                <section className="Homepage">
                    <GoToHomepage></GoToHomepage>
                </section>
                <section className="SetingsButton" style={SettingsStyle}>
                    <SettingsButton></SettingsButton>
                </section>
                <section className='PlayButton' style={PlayButtonStyle} onClick={gameSelectorLink}>
                    <PlayButton name="Play now" />
                </section>
                <section>
                    <Menu></Menu>
                </section>
            </div>
        </div>
    );
}

export default Home;
