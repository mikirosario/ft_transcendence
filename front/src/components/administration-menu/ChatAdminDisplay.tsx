import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack, IoMdSend } from 'react-icons/io';
import { FaSignOutAlt, FaInfoCircle } from 'react-icons/fa';
import { getChatDirect, sendDirectMessage, getChatChannel, sendChannelMessage } from '../../requests/Chat.Service';
import { getUserImage } from "../../requests/User.Service";
import { SocketContext1 } from '../../SocketContext';
import NotificationContext from '../../NotificationContext';
import { leaveChannel } from '../../requests/Channel.Service';

interface ChatDisplayProps {
    selectedChat: number;
    setSelectedChat: (chat: number) => void;
    isFriendChat: boolean;
}

interface Message {
    channelId: number,
    userId: number,
    sender: string,
    avatarUri: string,
    sentAt: string,
    message: string,
    isAdmin?: string,
    avatarFile?: string,
};

interface User {
    userId: number,
    nick: string,
    avatarUri: string,
}


const ChatDisplay: React.FC<ChatDisplayProps> = ({ selectedChat, setSelectedChat, isFriendChat }) => {
    const socket = useContext(SocketContext1);

    const { handleNotification } = useContext(NotificationContext);

    const [messagesList, setMessagesList] = useState<Message[]>([]);
    const [usersMap, setUsersMap] = useState<User[]>([]);
    const [message, setMessage] = useState('');
    const [showCommands, setShowCommands] = useState(false);

    const toggleCommands = () => {
        setShowCommands(!showCommands);
    }

    useEffect(() => {
        const fetchData = async () => {
            if (selectedChat !== 0) {
                let result;
                if (isFriendChat)
                    result = await getChatDirect(selectedChat);
                else
                    result = await getChatChannel(selectedChat);
                if (result && result.members && result.messages) {
                    const { members, messages } = result;
                    setUsersMap(members);
                    const messagesWithImages = await Promise.all(messages.map(async (msg: Message) => {
                        const imageUrl = await getUserImage(msg.avatarUri);
                        return { ...msg, avatarFile: imageUrl ?? '' };
                    }));
                    setMessagesList(messagesWithImages);
                }
            }
        };

        const handleNewDirectMessages = async (msg: Message) => {
            const imageUrl = await getUserImage(msg.avatarUri);
            msg.avatarFile = imageUrl ? imageUrl : '';
            setMessagesList(oldMessageList => [...oldMessageList, msg]);
        };

        const handleNewChannelMessages = async (msg: Message) => {
            if (selectedChat === msg.channelId) {
                const imageUrl = await getUserImage(msg.avatarUri);
                msg.avatarFile = imageUrl ? imageUrl : '';
                setMessagesList(oldMessageList => [...oldMessageList, msg]);
            }
        };

        const handleUpdateChannelJoin = async (newUserList: []) => {
            setUsersMap(newUserList);
        }

        // const handleUpdateChannelLeave = async (newUserList: []) => {
        //     setUsersMap(newUserList);
        // }


        const handleKickCommand = async (data: { channelId: number }) => {
            handleNotification('Te han echado/baneado del canal');
            if (selectedChat === data.channelId)
                setSelectedChat(0);
        }

        fetchData();
        if (isFriendChat)
            socket?.on("NEW_DIRECT_MESSAGE", handleNewDirectMessages);
        else {
            socket?.on("NEW_ADMIN_CHANNEL_MESSAGE", handleNewChannelMessages);
            socket?.on("UPDATE_CHANNEL_USERS_LIST_JOIN", handleUpdateChannelJoin);
            socket?.on("UPDATE_CHANNEL_USERS_LIST_LEAVE", handleUpdateChannelJoin);
            socket?.on("KICK_FROM_CHANNEL", handleKickCommand);
        }

        // return () => {
        //     if (isFriendChat) {
        //         socket.off("NEW_DIRECT_MESSAGE", handleNewDirectMessages);
        //     } else {
        //         socket.off("NEW_CHANNEL_MESSAGE", handleNewChannelMessages);
        //         socket.off("UPDATE_CHANNEL_USERS_LIST", handleUpdateChannel);
        //     }
        // };
    }, [selectedChat, socket]);

    const ChatWrapper: React.CSSProperties = {
        height: '80vh',
        width: '20vw',
        top: '0%',
        left: '80%',
        position: 'absolute',
    };

    const BackArrowStyle: React.CSSProperties = {
        top: '1%',
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    }

    const LeaveIconStyle: React.CSSProperties = {
        top: '1%',
        left: '66%',
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    }

    const InfoCommandsIconStyle: React.CSSProperties = {
        top: '1%',
        left: '62.5%',
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    }

    const HelpCommandPopUpStyle: React.CSSProperties = {
        position: 'absolute',
        top: '21.5%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(185, 180, 195, 0.9)',
        border: '1px solid #000',
        borderRadius: '10px',
        padding: '5px',
        width: '300px',
        zIndex: '1000'
    };

    const CloseButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '5px',
        right: '8px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px'
    };

    const TextAreaWrapperStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '6%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '90%',
        borderRadius: '15px',
        overflow: 'hidden',
    };

    const MessageInputStyle: React.CSSProperties = {
        width: '85%',
        padding: '8px',
        paddingRight: '40px',
        borderRadius: '15px',
        height: '50px',
        resize: 'none',
        border: 'none',
        outline: 'none',
        fontFamily: 'Quantico',
        fontSize: '16px',
        color: 'lightgray',
        background: 'RGB(19, 29, 45)',
    };

    const SendButtonStyle: React.CSSProperties = {
        position: 'absolute',
        right: '28px',
        bottom: '7.5%',
        background: 'transparent',
        border: 'none',
        color: 'gray',
        cursor: 'pointer'
    }

    // ----------- STYLOS DE MENSAJE ------------

    const MessagesContainerStyle: React.CSSProperties = {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '60vh',
        overflowY: 'auto',
        padding: '10px'
    };

    const MessageStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginLeft: '5%',
        width: '90%',
        position: 'relative',
        marginTop: '10px',
    };

    const UserImageStyle: React.CSSProperties = {
        marginLeft: '5px',
        marginTop: '5px',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        marginRight: '10px',
        objectFit: 'cover',
        display: 'flex',
        alignItems: 'center'
    };

    const MessageContentStyle: React.CSSProperties = {
        whiteSpace: 'pre-wrap',
        color: '#A9A9A9',
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Quantico',
        wordBreak: 'break-word',
        overflowWrap: 'break-word',
    };

    const UserNameStyle: React.CSSProperties = {
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px',
        marginTop: '16px',
    };

    const MessageInfoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%'
    };
    

    return (
        <div style={ChatWrapper}>
            <button style={BackArrowStyle} onClick={() => setSelectedChat(0)}>
                <IoMdArrowRoundBack size={27} color='grey' />
            </button>

            <button style={InfoCommandsIconStyle} onClick={toggleCommands}>
                <FaInfoCircle size={24} color='grey' />
            </button>

            {showCommands && (
                <div style={HelpCommandPopUpStyle}>
                    <h2>Lista de Comandos</h2>
                    <button style={CloseButtonStyle} onClick={toggleCommands}>X</button>
                    <ul>
                        {isFriendChat ? (
                            <>
                                <li style={{ fontSize: '14px' }}>/duel: Reta a un usuario a un Pong</li>
                                <li style={{ fontSize: '14px' }}>/spectate' Comienza a observar la partida de un usuario</li>
                                <li style={{ fontSize: '14px' }}>/block: Bloquea a un usuario</li>
                            </>
                        ) : (

                            <li style={{ fontSize: '14px' }}>/block: Bloquea a un usuario</li>
                        )

                        }
                    </ul>
                </div>
            )}

            <div style={MessagesContainerStyle}>
                {[...messagesList].reverse().map((messageItem, index) => {
                    return (
                        <div key={index} style={MessageStyle}>
                            <img
                                src={messageItem.avatarFile}
                                alt={messageItem.sender}
                                style={UserImageStyle}
                                // as={Link}
                                // to="/settings"       CHANGE TO USER PROFILEPAGE
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                            <div style={{ ...UserNameStyle, color: messageItem.isAdmin ? 'red' : UserNameStyle.color }}>
                                <span
                                    style={UserNameStyle}
                                    // as={Link}
                                    // to="/settings"   CHANGE TO USER PROFILEPAGE
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    {messageItem.sender}
                                </span>
                                <p style={MessageContentStyle}>
                                    {messageItem.message}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );

}
export default ChatDisplay;
