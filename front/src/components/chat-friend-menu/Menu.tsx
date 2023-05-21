import React from "react";
import UserProfile from "./ProfileDisplay";
import DefaultIMG from "../../assets/images/default.jpg"
import { useNavigate } from "react-router-dom";

function Menu() {

    const navigate = useNavigate();

    const gameSelectorLink = () => {
        // navigate('/GameSelector');
    };

    const MenuStyle: React.CSSProperties = {
        height: '100vh',
        width: '20vw',
        backgroundColor: '#1C2C4A',
        top: '0%',
        left: '80%',
        position: 'absolute',
    };

    const ProfileButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'none',
        height: '12%',
        width: '75%',
        top: '4%',
        left: '12%',
        position: 'absolute',
        cursor: 'pointer',
        borderRadius: '25%',
    };

    const FriendButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'none',
        fontFamily: 'Quantico',
        color: '#D4D4D4',
        fontSize: '1vw',
        height: '5vh',
        width: '50%',
        top: '18%',
        left: '0%',
        position: 'absolute',
        cursor: 'pointer',
        minBlockSize: '25px',
        borderBottom: '3px double black',
    };

    const ChannelsButtonStyle: React.CSSProperties = {
        border: 'none',
        background: 'none',
        fontFamily: 'Quantico',
        color: '#D4D4D4',
        fontSize: '1vw',
        height: '5vh',
        width: '50%',
        top: '18%',
        left: '50%',
        position: 'absolute',
        cursor: 'pointer',
        minBlockSize: '25px',
        borderBottom: '3px double black',
    }


    return (
        <div style={MenuStyle}>
            <button style={ProfileButtonStyle}>
                <UserProfile image={DefaultIMG} name={"Gonzaaaalo"}></UserProfile>
            </button>
            <button style={FriendButtonStyle}>
                Amigos
            </button>
            <button style={ChannelsButtonStyle}>
                Canales
            </button>
        </div>
    );
}

export default Menu;
