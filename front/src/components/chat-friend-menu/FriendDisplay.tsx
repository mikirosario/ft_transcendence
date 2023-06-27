import React, { useEffect, useState } from 'react';
import { addFriend, deleteFriend, getFriendList, getFriendRequests, updateFriendList } from '../../requests/Friend.Service';
import { getUserImage } from "../../requests/User.Service";
import { FaCaretDown, FaCaretUp, FaCheck, FaTimes } from 'react-icons/fa';
import { MdSend} from 'react-icons/md';

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
        transition: 'max-height 1s ease-in-out',
        overflow: 'hidden',
        maxHeight: showFriends ? '500px' : '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
        marginTop: '10px'
    }

    const dropDownStyle: React.CSSProperties = {
        color: 'white',
        left: '15%',
        width: '25%',
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
        marginLeft: '14%', 
        width: '60%',
    };
    
    const friendContainerStyle: React.CSSProperties = {
        marginBottom: '1%',
        borderRadius: '8px',
        border: 'none',
        background: 'transparent',
        position: 'relative',
        cursor: 'pointer',
        transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
        maxHeight: '52px',
        maxWidth: '62px'
    };

    const avatarWrapperStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'green',
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
        margin: 'auto', // Add 'auto' to center the avatar within its container
        position: 'relative',
    };

    const nameStyle: React.CSSProperties = {
        width: '66px',
        height: '45px',
        left: '45px',
        bottom: '62px',
        position: 'relative',
        justifyContent: 'center',
        fontSize: '15px',
        color: '#c0c0c0',
        display: 'flex',
        alignItems: 'center',
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
        transition: 'opacity 2.3s ease-in-out',
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

    const handleFriendSumbit = async (event: React.FormEvent) => {
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
                            onClick={handleFriendSumbit}
                        >
                            <MdSend style={addFriendInputTextSendStyle} size={20} />
                        </button>
                    </div>
                )}

            </div>
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
                                        backgroundColor: isRequestHovered === index ? 'lightgreen' : 'green'
                                    }}>
                                        <img
                                            className='FriendAvatar'
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
                                                onClick={async () => await deleteFriend(request.nick)}
                                            />
                                        </div>
                                    )}
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
