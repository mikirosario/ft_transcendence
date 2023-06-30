import React from "react";
import axios from 'axios';
import HomeButton from "../components/B_Home";
import { Route, Router, useNavigate } from 'react-router-dom';
import SocialMenu from "../components/chat-friend-menu/SocialMenu";

function Profile() {
    const navigate = useNavigate();

    //<<< STYLES >>>//
    const BodyStyle: React.CSSProperties = {
        display: 'flex',
        height: '100vh',
    }

    const Content: React.CSSProperties = {
        width: '80vw',
        display: 'flex',
        justifyContent: 'center',
        gap: '50px',
        alignItems: 'center',
    }

    const Stats: React.CSSProperties = {
        background: 'black',
        display: 'flex',
        height: '875px',
        width: '550px',
    }

    const Info: React.CSSProperties = {
        
    }

    const History: React.CSSProperties = {
        background: '#4C5970',
        display: 'flex',
        flexDirection: 'column',
        height: '875px',
        width: '550px',
        borderRadius: '15px',
    }

    const Histodd: React.CSSProperties = {
        width: '100%',
        height: '20%'
    }

    const Histeven: React.CSSProperties = {
        width: '100%',
        height: '20%',
        background: 'rgba(255, 255, 255, 0.3)'
    }

    //<<< FUNCTIONS >>>//


    //<<< BUILD >>>//
    return (
        <body style={BodyStyle}>
            <SocialMenu></SocialMenu>
            <div style={Content}>
                <HomeButton></HomeButton>
                <div style={Stats}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div style={History}>
                    <div style={Histodd}></div>
                    <div style={Histeven}></div>
                    <div style={Histodd}></div>
                    <div style={Histeven}></div>
                    <div style={Histodd}></div>
                </div>
            </div>
        </body>
    );
}

export default Profile;