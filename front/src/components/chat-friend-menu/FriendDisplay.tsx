import React, { useEffect, useState } from 'react';
import { addFriend, deleteFriend, getBlockedUsers, getFriendList, getFriendRequests, updateFriendList } from '../../requests/Friend.Service';
import { getUserImage } from "../../requests/User.Service";
import { FaCaretDown, FaCaretUp, FaCheck, FaTimes } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

interface Friend {
    userId: number;
    nick: string;
    avatarUri: string;
    isOnline: boolean;
    isInGame: boolean;
    avatarFile?: string;
}

function FriendDisplay({ openChat }: { openChat: (friendName: number) => void }) {
    const [friendList, setFriendList] = useState<Friend[]>([]);
    const [friendPetitionList, setFriendLPetitionList] = useState<Friend[]>([]);
    const [blockedUsersList, setBlockedUsersList] = useState<Friend[]>([]);
    const [isHovered, setIsHovered] = useState(false);
    const [friendName, setFriendName] = useState('');
    const [showFriends, setShowFriends] = useState(false);

    const [showRequests, setShowRequests] = useState(false);
    const [isAcceptHovered, setIsAcceptHovered] = useState(false);
    const [isRejectHovered, setIsRejectHovered] = useState(false);

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

        const fetchBlockedUsers = async () => {
            const blockedUsersRequest = await getBlockedUsers();
            const blockedUsersWithImages = await Promise.all(blockedUsersRequest.map(async (blockedUser: { avatarUri: string; nick: string; userId: number}) => {
                const imageUrl = await getUserImage(blockedUser.avatarUri);
                return {
                    userId: blockedUser.userId,
                    nick: blockedUser.nick,
                    avatarFile: imageUrl,
                    isOnline: false,
                    isInGame: false,
                };
            }));
            setBlockedUsersList(blockedUsersWithImages);
        };

        fetchFriends();
        fetchFriendPetition();
        fetchBlockedUsers();
    }, []);

    // ------------------ STYLES ----------------------------

    const FriendWrapper: React.CSSProperties = {
        height: '100vh',
        width: '20vw',
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
        paddingBottom: '6px',
        overflow: 'hidden',
        maxHeight: showFriends ? '500px' : '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        marginTop: '10px',
        transition: 'max-height 0.8s ease-in-out',
    }

    const dropDownStyle: React.CSSProperties = {
        color: 'white',
        left: '12%',
        width: '28%',
        background: 'transparent',
        border: 'none',
        scale: '1.4',
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-start'
    }

    // Friends Display
    const friendsListStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: '2.5%',
        marginLeft: '9%',
        width: '66%',
        // overflowY: 'scroll',
    };

    const friendContainerStyle: React.CSSProperties = {
        width: '35%',
        marginBottom: '3%',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
        maxHeight: '52px',
    };

    const avatarWrapperStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'blue', // if offline gris
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: '5%',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out, background-color 0.8s ease',
    };
    
    const avatarStyle: React.CSSProperties = {
        width: '45px',
        height: '45px',
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };
    const nameStyle: React.CSSProperties = {
        width: '85px',
        height: '38px',
        left: '45px',
        bottom: '56px',
        position: 'relative',
        justifyContent: 'flex-start',
        fontSize: '14px',
        color: '#c0c0c0',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '10px'
    }

    const buttonContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        height: '72.2%',
        width: '100%'
    };

    const iconContainerStyle: React.CSSProperties = {
        position: 'absolute',
        left: '100px',
        top: '0px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '25px',
        height: '50%',
        opacity: 0.5,
        transition: 'opacity 1.5s ease-in-out',
    };

    const iconStyle: React.CSSProperties = {
        margin: '5px',
    };

    const getIconStyle = (isHovered: boolean, color: string): React.CSSProperties => ({
        ...iconStyle,
        color: isHovered ? color : 'pink',
        opacity: isHovered ? 1 : 0.70,
        transition: 'color 0.2s ease-in-out, opacity 0.2s ease-in-out',
    });

    const handleRequestsClick = () => {
        setShowRequests(!showRequests);
    };

    const handleClick = () => {
        setShowFriends(!showFriends);
    };

    const handleBlockedClick = () => {
        setShowBlocked(!showBlocked);
    };

    const handleFriendSumbit = async (event: React.FormEvent) => {
        event.preventDefault();

        await addFriend(friendName);
    }

    // const openFriendChat = async (friendName: string) => {
    //     // create chat window
    //     // await createFriendChat(friendName);
    // }

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
                            onClick={handleFriendSumbit}
                        >
                            <MdSend style={addFriendInputTextSendStyle} size={20} />
                        </button>
                    </div>
                )}

            </div>
            {/* AMIGOS */}
            <div style={buttonContainerStyle}>
                <div style={dropDownContainerStyle}>
                    <button onClick={handleClick} style={dropDownStyle}>
                        Amigos
                        {showFriends ? <FaCaretUp /> : <FaCaretDown />}
                    </button>

                    <div style={friendsListStyle}>
                        {friendList.map((friend, index) => (
                            <button
                                key={index}
                                style={friendContainerStyle}
                                onMouseEnter={() => setIsFriendHovered(index)}
                                onMouseLeave={() => setIsFriendHovered(-1)}
                                onClick={() => openChat(friend.userId)}
                            >
                                <div style={{
                                    transform: isFriendHovered === index ? 'scale(1.1)' : 'none',
                                    transition: 'transform 0.3s ease-in-out',
                                }}>
                                    <div style={{
                                        ...avatarWrapperStyle,
                                        backgroundColor: isFriendHovered === index ? 'lightgreen' : 'green'
                                    }}>
                                        <img
                                            className='FriendAvatar'
                                            alt={'Avatar de' + friend.nick}
                                            src={friend.avatarFile}
                                            style={avatarStyle}
                                        />
                                        
                                    </div>
                                    <p style={nameStyle}>{friend.nick}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* PETICIONES */}
                <div style={{ ...dropDownContainerStyle, maxHeight: showRequests ? '500px' : '15px' }}>
                    <button onClick={handleRequestsClick} style={dropDownStyle}>
                        Peticiones
                        {showRequests ? <FaCaretUp /> : <FaCaretDown />}
                    </button>

                    <div style={friendsListStyle}>
                        {friendPetitionList.map((request, index) => (
                            <button
                                key={index}
                                style={friendContainerStyle}
                                onMouseEnter={() => setIsRequestHovered(index)}
                                onMouseLeave={() => setIsRequestHovered(-1)}
                            >
                                <div style={{
                                    transform: isRequestHovered === index ? 'scale(1.1)' : 'none',
                                    transition: 'transform 0.3s ease-in-out',
                                }}>
                                    <div style={{
                                        ...avatarWrapperStyle,
                                        backgroundColor: isRequestHovered === index ? 'cyan' : 'darkcyan'
                                    }}>
                                        <img
                                            className='FriendAvatar'
                                            alt={'Avatar de' + request.nick}
                                            src={request.avatarFile}
                                            style={avatarStyle}
                                        />
                                    </div>
                                    <p style={nameStyle}>{request.nick}</p>
                                    {isRequestHovered === index && (
                                        <div style={iconContainerStyle}>
                                            <FaCheck
                                                onMouseEnter={() => setIsAcceptHovered(true)}
                                                onMouseLeave={() => setIsAcceptHovered(false)}
                                                style={getIconStyle(isAcceptHovered, 'green')}
                                                size={15}
                                                onClick={async () => await updateFriendList(request.nick)}
                                            />

                                            <FaTimes
                                                onMouseEnter={() => setIsRejectHovered(true)}
                                                onMouseLeave={() => setIsRejectHovered(false)}
                                                style={getIconStyle(isRejectHovered, 'red')}
                                                size={16}
                                                onClick={async () => await deleteFriend(request.nick)} // No se borra
                                            />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                 {/* BLOQUEADOS */}
                <div style={{ ...dropDownContainerStyle, maxHeight: showBlocked ? '500px' : '15px' }}>
                    <button onClick={handleBlockedClick} style={dropDownStyle}>
                        Bloqueados
                        {showBlocked ? <FaCaretUp /> : <FaCaretDown />}
                    </button>

                    <div style={friendsListStyle}>
                        {blockedUsersList.map((blockedUser, index) => (
                            <button
                                key={index}
                                style={friendContainerStyle}
                                onMouseEnter={() => setIsBlockedHovered(index)}
                                onMouseLeave={() => setIsBlockedHovered(-1)}
                                // onClick={async () => await unblockFriend(blockedUser.nick)}
                            >
                                <div style={{
                                    transform: isBlockedHovered === index ? 'scale(1.1)' : 'none',
                                    transition: 'transform 0.3s ease-in-out',
                                }}>
                                    <div style={{
                                        ...avatarWrapperStyle,
                                        backgroundColor: isBlockedHovered === index ? 'lightgray' : 'gray'
                                    }}>
                                        <img
                                            className='FriendAvatar'
                                            alt={'Avatar de' + blockedUser.nick}
                                            src={blockedUser.avatarFile}
                                            style={avatarStyle}
                                        />
                                    </div>
                                    <p style={nameStyle}>{blockedUser.nick}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div >
        </div>
    );
}

export default FriendDisplay;
