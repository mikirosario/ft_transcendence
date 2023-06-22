import React, { useEffect, useState } from 'react';
import { addFriend, getFriendList, getFriendRequests } from '../../requests/Friend.Service';
import { getUserImage } from "../../requests/User.Service";
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

interface Friend {
    nick: string;
    avatarUri: string;
    isOnline: boolean;
    isInGame: boolean;
    avatarFile?: string;
}

const FriendDisplay: React.FC = () => {
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [friendPetitionList, setFriendLPetitionList] = useState<Friend[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [friendName, setFriendName] = useState('');
    const [showFriends, setShowFriends] = useState(false);
    const [showRequests, setShowRequests] = useState(false);
    const [showBlocked, setShowBlocked] = useState(false);

    const [isFriendHovered, setIsFriendHovered] = useState(-1);
    const [isRequestHovered, setIsRequestHovered] = useState(-1);
    const [isBlockedHovered, setIsBlockedHovered] = useState(-1);

    useEffect(() => {
        const fetchFriends = async () => {
            const friendsRequest = await getFriendList();
            const friendsWithImages = await Promise.all(friendsRequest.friends.map(async (friend: { avatarUri: string; }) => {
                const imageUrl = await getUserImage(friend.avatarUri);
                return { ...friend, avatarFile: imageUrl };
            }));
            setFriendList(friendsWithImages);
        };

        const fetchFriendPetition = async () => {
            const friendsRequest = await getFriendRequests();
            const friendsWithImages = await Promise.all(friendsRequest.friends.map(async (friend: { avatarUri: string; }) => {
                const imageUrl = await getUserImage(friend.avatarUri);
                return { ...friend, avatarFile: imageUrl };
            }));
            setFriendLPetitionList(friendsWithImages);
        };

        fetchFriends();
        fetchFriendPetition();
    }, []);


    // ------------------ STYLES ----------------------------

    const FriendWrapper: React.CSSProperties = {
        height: '100vh',
        width: '20vw',
        // backgroundColor: 'pink',
        top: '0%',
        left: '80%',
        position: 'absolute',
    };

    const addFriendButtonWrapper: React.CSSProperties = {
        top: '2%',
        left: '20%',
        width: '60%',
        height: '40px',
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        position: "relative",
    };

    const addFriendButtonStyle: React.CSSProperties = {
        width: "100%",
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
        borderRadius: '12px',
        border: 'none',
        fontFamily: "'Press Start 2P'",
        fontSize: "11px",
        position: "relative",
        textAlign: "center",
    }

    const addFriendInputWrapperStyle: React.CSSProperties = {
        width: '100%',
        background: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 110%)',
        borderRadius: '12px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const addFriendInputTextStyle: React.CSSProperties = {
        border: 'none',
        fontFamily: "'Press Start 2P'",
        left: '8px',
        position: 'relative',
        fontSize: "12px",
        height: '22px',
        width: "150px",
        background: 'transparent',
        textAlign: 'center',
        borderBottom: '2px solid black',
    }

    const addFriendInputTextSendStyle: React.CSSProperties = {
        marginLeft: '12px',
        cursor: 'pointer'
    }

    // Dropdown Users/Petitions 
    const dropDownContainerStyle: React.CSSProperties = {
        position: 'relative',
        top: '30px',
        width: '100%',
        paddingBottom: '15px',
        transition: 'max-height 1s ease-in-out',
        overflow: 'hidden',
        maxHeight: showFriends ? '500px' : '15px',
    }

    const dropDownStyle: React.CSSProperties = {
        color: 'white',
        right: '30%',
        width: '100%',
        background: 'transparent',
        border: 'none',
        scale: '1.4',
        cursor: 'pointer',
        position: 'relative'
    }

    // Friends Display
    const friendsListStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: '5%',
        marginTop: '1%',
        marginLeft: '11%',
    }

    const friendContainerStyle: React.CSSProperties = {
        marginBottom: '16px',
        top: '10px',
        width: '42%',
        height: '65px',
        borderRadius: '8px',
        background: 'green',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
    }

    const avatarStyle: React.CSSProperties = {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        left: '-30%',
        top: '12%',
        position: 'relative',
    }

    const nameStyle: React.CSSProperties = {
        width: '0px',
        height: '0px',
        left: '42%',
        bottom: '66%',
        position: 'relative'
    }


    const handleClick = () => {
        setShowFriends(!showFriends);
    };

    const handleFriendSumbitRequest = async (event: React.FormEvent) => {
        event.preventDefault();

        await addFriend(friendName);
    }

    return (
        <div style={FriendWrapper}>
            <div
                style={addFriendButtonWrapper}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {!isHovered && (
                    <button style={addFriendButtonStyle}>
                        Añadir amigo
                    </button>
                )}
                {isHovered && (
                    <div style={addFriendInputWrapperStyle}>
                        <input style={addFriendInputTextStyle}
                            type="text"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                            maxLength={10} />
                        <button
                            style={{ backgroundColor: 'transparent', border: 'none' }}
                            onClick={handleFriendSumbitRequest}
                        >
                            <MdSend style={addFriendInputTextSendStyle} size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* AMIGOS */}
            <div style={dropDownContainerStyle}>
                <button onClick={handleClick} style={dropDownStyle}>
                    Amigos
                    {showFriends ? <FaCaretUp /> : <FaCaretDown />}
                </button>

                <div style={friendsListStyle}>
                    {friendList.map((friend, index) => (
                        <button
                            key={index}
                            style={{
                                ...friendContainerStyle,
                                transform: isFriendHovered === index ? 'scale(1.1)' : 'none',
                                backgroundColor: isFriendHovered === index ? 'lightgreen' : 'green'
                            }}
                            onMouseEnter={() => setIsFriendHovered(index)}
                            onMouseLeave={() => setIsFriendHovered(-1)}
                        >
                            <img
                                className='FriendAvatar'
                                src={friend.avatarFile}
                                style={avatarStyle}
                            />
                            <p style={nameStyle}>{friend.nick}</p>
                        </button>
                    ))}
                </div>
            </div>
            {/* PETICIONES */ }
            <div style={{ ...dropDownContainerStyle, left: '12px', maxHeight: showRequests ? '500px' : '15px' }}>
                <button onClick={() => setShowRequests(!showRequests)} style={dropDownStyle}>
                    Peticiones
                    {showRequests ? <FaCaretUp /> : <FaCaretDown />}
                </button>

                <div style={friendsListStyle}>
                    {friendPetitionList.map((request, index) => (
                        <button
                            key={index}
                            style={{
                                ...friendContainerStyle,
                                transform: isRequestHovered === index ? 'scale(1.1)' : 'none',
                                backgroundColor: isRequestHovered === index ? 'lightgreen' : 'green'
                            }}
                            onMouseEnter={() => setIsRequestHovered(index)}
                            onMouseLeave={() => setIsRequestHovered(-1)}
                        >
                            <img className='FriendAvatar' src={request.avatarFile} style={avatarStyle} />
                            <p style={nameStyle}>{request.nick}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/*BLOQUEADOS 
            <div style={{ ...dropDownContainerStyle, maxHeight: showBlocked ? '500px' : '0' }}>
                <button onClick={() => setShowBlocked(!showBlocked)} style={dropDownStyle}>
                    Bloqueados
                    {showBlocked ? <FaCaretUp /> : <FaCaretDown />}
                </button>

                <div style={friendsListStyle}>
                    {blockedList.map((blocked, index) => (
                        <button
                            key={index}
                            style={{
                                ...friendContainerStyle,
                                transform: isBlockedHovered === index ? 'scale(1.1)' : 'none',
                                backgroundColor: isBlockedHovered === index ? 'lightgreen' : 'green'
                            }}
                            onMouseEnter={() => setIsBlockedHovered(index)}
                            onMouseLeave={() => setIsBlockedHovered(-1)}
                        >
                            <img className='FriendAvatar' src={blocked.avatarFile} style={avatarStyle} />
                            <p style={nameStyle}>{blocked.nick}</p>
                        </button>
                    ))}
                </div>
            </div> */}
        </div >
    );

}

export default FriendDisplay;



// const friendButtonWrapperStyle: React.CSSProperties = {
//     display: 'flex',
//     justifyContent: 'space-around',
//     position: 'absolute',
//     width: '100%',
//     bottom: '-20px',
//     left: '0',
//     transition: 'opacity 0.3s ease-in-out',
//     opacity: '0',
//     pointerEvents: 'none',
// };

// const friendButtonStyle: React.CSSProperties = {
//     backgroundColor: 'blue',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '5px',
// };

// const [showFriendButtons, setShowFriendButtons] = useState(Array(friendList.length).fill(false));

// <div style={friendsListStyle}>
// {friendList.map((friend, index) => (
//     <div
//         style={{
//             ...friendContainerStyle,
//             transform: isFriendHovered === index ? 'scale(1.1)' : 'none',
//             backgroundColor: isFriendHovered === index ? 'lightgreen' : 'green',
//             position: 'relative',
//         }}
//         onMouseEnter={() => {
//             const newShowFriendButtons = [...showFriendButtons];
//             newShowFriendButtons[index] = true;
//             setShowFriendButtons(newShowFriendButtons);
//             setIsFriendHovered(index);
//         }}
//         onMouseLeave={() => {
//             const newShowFriendButtons = [...showFriendButtons];
//             newShowFriendButtons[index] = false;
//             setShowFriendButtons(newShowFriendButtons);
//             setIsFriendHovered(-1);
//         }}
//     >
//         <img className='FriendAvatar' src={friend.avatarFile} style={avatarStyle} />
//         <p style={nameStyle}>{friend.nick}</p>
//         <div style={{ ...friendButtonWrapperStyle, opacity: showFriendButtons[index] ? '1' : '0', pointerEvents: showFriendButtons[index] ? 'all' : 'none' }}>
//             <button style={friendButtonStyle}>Perfil</button>
//             <button style={friendButtonStyle}>Chat</button>
//             <button style={friendButtonStyle}>Eliminar</button>
//         </div>
//     </div>
// ))}
// </div>