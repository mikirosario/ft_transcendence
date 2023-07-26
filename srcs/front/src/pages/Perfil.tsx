import React, { useEffect, useState } from "react";
import { getUserProfile } from "../requests/User.Service";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";

function Perfil() {
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState<string>('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userProfile = await getUserProfile();
                setUsername(userProfile.username);
                setUserImage(userProfile.userImage);
            } catch (error) {
                // throw error
            }
        };

        fetchUserProfile();
    }, []);


    const ContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        minHeight: '100vh',
        marginRight: '200px'
    };

    const ProfileStyle: React.CSSProperties = {
        border: 'none',
        background: 'black',
        width: '16vw',
        height: '38vw', // Aumentar el tamaño para acomodar el contenido adicional
        top: '100px',
        right: '0px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    };

    const AvatarStyle: React.CSSProperties = {
        width: '8vw',
        height: '8vw',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '1.5vw',
    };

    const NameStyle: React.CSSProperties = {
        fontFamily: 'Quantico',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: '1.5vw',
        maxWidth: '90%',
    };

    const RankStyle: React.CSSProperties = {
        ...NameStyle, // Utiliza los mismos estilos base que NameStyle
        fontSize: '1.2vw', // ajustar según sea necesario
        color: 'gold',
    };

    const WinLossContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        fontSize: '1.0vw', // ajustar según sea necesario
    }

    const WinStyle: React.CSSProperties = {
        ...NameStyle,
        color: 'green',
    }

    const LossStyle: React.CSSProperties = {
        ...NameStyle,
        color: 'red',
    }

    const HistoryMatch: React.CSSProperties = {
        border: 'none',
        background: 'black',
        width: '40vw',
        height: '38vw', // Aumentar el tamaño para acomodar el contenido adicional
        top: '100px',
        right: '150px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    };

    return (
        <div style={ContainerStyle}>

            <div style={ProfileStyle}>
                <img style={AvatarStyle} src={userImage} alt={`Profile of ${username}`} />
                <h1 style={NameStyle}>{username}</h1>
                <h2 style={RankStyle}>Rank: #2</h2>
                <div style={WinLossContainerStyle}>
                    <h3 style={WinStyle}>Wins: 10</h3>
                    <h3 style={LossStyle}>Losses: 5</h3>
                </div>
            </div>
            <div style={HistoryMatch}>

            </div>
            <SocialMenu></SocialMenu>
        </div>
    );
}

export default Perfil;
