import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/RoundStartButton";
import SettingsButton from "../components/home/SettingsButton";
import GoToHomepage from "../components/home/Home";

function Home() {
    const navigate = useNavigate();
    const PlayButtonStyle: React.CSSProperties = {
        transform: 'scale(1.3)',
        position: 'absolute',
        top: '250px',
        left: '760px',
        display: 'flex',
        alignItems: 'flex-end',
    };


    const SettingsStyle: React.CSSProperties = {
        position: 'fixed',
        top: '350px',
        left: '815px',
        display: 'flex',
        alignItems: 'flex-end',
        scale: '1.2'
    };


    const gameSelectorLink = () => {
        navigate('/GameSelector');
    };

    return (
        <div>
            <section className="Homepage">
                <GoToHomepage></GoToHomepage>
            </section>
            <section className="SetingsButton"style={SettingsStyle}>
                <SettingsButton></SettingsButton>
            </section>
            <section className='PlayButton' style={PlayButtonStyle} onClick={gameSelectorLink}>
                <PlayButton name="Play now"/>
            </section>
        </div>
    );
}

export default Home;