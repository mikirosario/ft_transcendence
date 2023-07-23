import React, { useEffect } from "react";
import { useContext } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import SettingsButton from "../components/home/SettingsButton";
import HomeButton from "../components/B_Home";
import GameButton from "../components/B_General";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";
import { SocketProvider1,SocketProvider2 } from "../SocketContext";

function Home() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        return () => {
          if (location.pathname === "/register") {
            navigate('/homepage');
          }
        };
      }, [location, navigate]);

    const Window: React.CSSProperties = {
        height: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
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

    const GoGameSelector = () => {
        navigate('/gameSelector');
    };

    return (
        <SocketProvider1>
            <SocketProvider2>
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
            </SocketProvider2>
        </SocketProvider1>
    );
}

export default Home;
