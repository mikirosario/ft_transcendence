import React, { useEffect, useState } from "react";
import { getUserProfile } from "../requests/User.Service";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";
import { useParams } from "react-router-dom";

interface User {
    nick: string,
    avatarUri: string,
    rank: number,
}

interface ProfileUser extends User {
    wins: number,
    losses: number,
}

interface MatchUser extends User {
    score: number;
    isWinner: boolean;
}

interface Match {
    user1: MatchUser;
    user2: MatchUser;
}

// const defaultMatches: Match[] = [
//     { oponentName: "Player 1", oponentURI: "", score: "5-3", oponentImage: "https://via.placeholder.com/50" },
//     { oponentName: "Player 2", oponentURI: "", score: "2-5", oponentImage: "https://via.placeholder.com/50" },
//     { oponentName: "Player 3", oponentURI: "", score: "4-4", oponentImage: "https://via.placeholder.com/50" },
//     { oponentName: "Player 4", oponentURI: "", score: "6-2", oponentImage: "https://via.placeholder.com/50" },
//     { oponentName: "Player 5", oponentURI: "", score: "5-5", oponentImage: "https://via.placeholder.com/50" },
// ];

function Perfil() {

    const { username } = useParams();
    const [actualUsername, setActualUsername] = useState('');
    const [userImage, setUserImage] = useState<string>('');
    const [matchInfo, setMatchInfo] = useState<Match[]>();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!username) {
                    getUserProfile().then(userProfile => {
                        setActualUsername(userProfile.username);
                        setUserImage(userProfile.userImage);
                    });
                } 
                // else {
                //     getUser(username).then(userProfile => {
                //         setActualUsername(username);
                //         setUserImage(userProfile.userImage);
                //     })
                // }
            } catch (error) {
                console.log(error);
            }
        };

        fetchUserProfile();
    }, [username]);


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
        background: 'transparent',
        width: '16vw',
        height: '38vw',
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
        ...NameStyle,
        fontSize: '1.2vw',
        color: 'gold',
    };

    const WinLossContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        fontSize: '1.0vw',
    }

    const WinStyle: React.CSSProperties = {
        ...NameStyle,
        color: 'green',
    }

    const LossStyle: React.CSSProperties = {
        ...NameStyle,
        color: 'red',
    }

    const HistoryMatchStyle: React.CSSProperties = {
        border: 'none',
        background: 'transparent',
        width: '40vw',
        height: '38vw',
        top: '100px',
        right: '150px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
    };

    const MatchStyle: React.CSSProperties = {
        border: '1px solid white',
        background: 'grey',
        width: '100%',
        height: '20%',
        margin: '0.5%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
    };

    const MatchImageStyle: React.CSSProperties = {
        width: '5vw',
        height: '5vw',
        objectFit: 'cover',
        borderRadius: '50%',
        marginLeft: '5%',
        marginRight: '3%'
    };

    const MatchInfoStyle: React.CSSProperties = {
        fontFamily: 'Quantico',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: '1vw',
        maxWidth: '75%',
    };

    return (
        <div style={ContainerStyle}>

            <div style={ProfileStyle}>
                <img style={AvatarStyle} src={userImage} alt={`Profile of ${actualUsername}`} />
                <h1 style={NameStyle}>{actualUsername}</h1>
                <h2 style={RankStyle}>Rank: #2</h2>
                <div style={WinLossContainerStyle}>
                    <h3 style={WinStyle}>Wins: 10</h3>
                    <h3 style={LossStyle}>Losses: 5</h3>
                </div>
            </div>
            {/* <div style={HistoryMatchStyle}>
                {matchInfo && matchInfo.map((match, index) => (
                    <div key={index} style={MatchStyle}>
                        <img style={MatchImageStyle} src={userImage} alt={`User: ${actualUsername}`} />
                        <p style={MatchInfoStyle}>{actualUsername} </p>
                        <p style={MatchInfoStyle}>{match.score}</p>
                        <p style={MatchInfoStyle}>{match.oponentName} </p>
                        <img style={MatchImageStyle} src={match.oponentImage} alt={`Opponent: ${match.oponentName}`} />
                    </div>
                ))}
            </div> */}
            <SocialMenu></SocialMenu>
        </div>
    );
}

export default Perfil;
