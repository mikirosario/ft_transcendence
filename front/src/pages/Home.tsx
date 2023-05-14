import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/PlayButton";
import AuthLoginButton from "../components/home/AuthButton";
import SettingsButton from "../components/home/SettingsButton";

function Home() {
    const navigate = useNavigate();
    const PlayButtonStyle: React.CSSProperties = {
        transform: 'scale(1.3)',
        position: 'absolute',
        top: '700px',
        left: '250px',
        display: 'flex',
        alignItems: 'flex-end',
    };

    const AuthLoginStyle: React.CSSProperties = {
        position: 'fixed',
        top: '220px',
        left: '150px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '125px',
    };

    const gameSelectorLink = () => {
        navigate('/GameSelector');
    };

    const AuthLoginLink = () => {
        window.location.href = 'XXXXX'; // Auth URL
    };


    return (
        <div >
            <h1>this is the homepage </h1>
            <section className="SetingsButton">
                <SettingsButton></SettingsButton>
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