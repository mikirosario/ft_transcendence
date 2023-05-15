import React from "react";
import { useNavigate } from 'react-router-dom';
import PlayButton from "../components/home/PlayButton";
import SettingsButton from "../components/home/SettingsButton";
import SwitchChatLadder from "../components/chat-ladder/ChatLadderSwitch";

function Home() {
    const navigate = useNavigate();

    const AuthLoginStyle: React.CSSProperties = {
        position: 'absolute',
        top: '80%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

    const AuthLoginLink = () => {
        // window.location.href = 'xxxx'; // Auth URL
        navigate('/homepage');
    };


    return (
        <div>
            <h1> Register page with 42 Auth </h1>
            <section className='AuthLoginButton' style={AuthLoginStyle} onClick={AuthLoginLink}>
                <PlayButton name="Login"/>
            </section>

        </div>
    );
}

export default Home;