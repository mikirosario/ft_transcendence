import React, { useEffect, useState } from "react";
import { getUserImage } from "../requests/User.Service";
import { getLeaderboard } from "../requests/GameData.Service";
import SocialMenu from "../components/chat-friend-menu/SocialMenu";
import HomeButton from "../components/B_Home";

interface LeaderboardUser {
    nick: string,
    avatarUri: string,
    rank: number,
    wins: number,
    losses: number,
    played: number,
    avatarFile?: string
}

function Leaderboard() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                getLeaderboard().then(async leader => {
                    const usersWithImages = await Promise.all(leader.data.map(async (user: LeaderboardUser) => {
                        const imageUrl = await getUserImage(user.avatarUri);
                        return {
                            ...user, avatarFile: imageUrl ?? '',
                        };
                    }));
                    setUsers(usersWithImages);
                })
            } catch (error) {
                console.log(error);
            }
        };

        fetchUsers();
    }, []);

    const ContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
    };

    const LeaderboardStyle: React.CSSProperties = {
        border: 'none',
        background: 'transparent',
        width: '40vw',
        height: 'auto',
        right: '50px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '1em',
    };

    const UserStyle: React.CSSProperties = {
        border: '1px solid white',
        background: 'grey',
        width: '80%',
        height: 'auto',
        margin: '0.5%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        padding: '1em',
    };

    const UserImageStyle: React.CSSProperties = {
        width: '5vw',
        height: '5vw',
        objectFit: 'cover',
        borderRadius: '50%',
        marginLeft: '5%',
        marginRight: '3%'
    };

    const UserDetailsStyle: React.CSSProperties = {
        fontFamily: 'Quantico',
        fontWeight: 'bold',
        textAlign: 'left',
        fontSize: '1vw',
        maxWidth: '75%',
    };


    return (
        <div style={ContainerStyle}>
            <HomeButton></HomeButton>
            <div style={LeaderboardStyle}>
                {users.slice(0, 10).map((user, index) => (
                    <div key={index} style={UserStyle}>
                        <img style={UserImageStyle} src={user.avatarFile} alt={`Profile of ${user.nick}`} />
                        <p style={UserDetailsStyle}>{user.nick}</p>
                        <p style={UserDetailsStyle}>Rank: {user.rank}</p>
                        <p style={UserDetailsStyle}>Wins: {user.wins}</p>
                        <p style={UserDetailsStyle}>Losses: {user.losses}</p>
                    </div>
                ))}
            </div>
            <SocialMenu></SocialMenu>
        </div>
    );
}

export default Leaderboard;
