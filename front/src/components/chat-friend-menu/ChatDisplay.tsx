import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack, IoMdSend } from 'react-icons/io';
import { FaSignOutAlt } from 'react-icons/fa';
import { getChatDirect, sendDirectMessage, getChatChannel, sendChannelMessage } from '../../requests/Chat.Service';
import { getUserImage } from "../../requests/User.Service";
import { SocketContext1 } from '../../SocketContext';
import NotificationContext from '../../NotificationContext';
import { leaveChannel } from '../../requests/Channel.Service';

//Opcion de usuario

interface ChatDisplayProps {
    selectedChat: number;
    setSelectedChat: (chat: number | null) => void;
    isFriendChat: boolean;
}

interface Message {
    sender: string,
    sentAt: string,
    message: string,
};

interface User {
    userId: number;
    nick: string;
    avatarUri: string;
    avatarFile?: string;
}


const ChatDisplay: React.FC<ChatDisplayProps> = ({ selectedChat, setSelectedChat, isFriendChat }) => {
    const socket = useContext(SocketContext1);

    const { handleNotification } = useContext(NotificationContext);

    const [messagesList, setMessagesList] = useState<Message[]>([]);
    const [usersMap, setUsersMap] = useState<{ [id: string]: User }>({});
    const [userInChannelsMap, setUserInChannelsMap] = useState<{ [id: string]: User }>({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (selectedChat !== null) {
                let result;
                if (isFriendChat)
                    result = await getChatDirect(selectedChat);
                else
                    result = await getChatChannel(selectedChat);
                if (result && result.members && result.messages) {
                    const { members, messages } = result;
                    const usersWithImages = await Promise.all(members.map(async (user: User) => {
                        const imageUrl = await getUserImage(user.avatarUri);
                        return { ...user, avatarFile: imageUrl ?? '' };
                    }));
                    setMessagesList(messages);
                    const usersMap = usersWithImages.reduce((acc, currUser) => {
                        acc[currUser.nick] = currUser;
                        return acc;
                    }, {} as { [key: string]: User });
                    setUsersMap(usersMap);
                    setUserInChannelsMap(usersMap);
                }
            }
        };

        const handleNewDirectMessages = async (msg: Message) => {
            setMessagesList(oldMessageList => [...oldMessageList, msg]);
        };

        const handleUpdateChannelJoin = async (newUserList: []) => {
            const usersWithImages = await Promise.all(newUserList.map(async (user: User) => {
                const imageUrl = await getUserImage(user.avatarUri);
                return { ...user, avatarFile: imageUrl ?? '' };
            }));
            const usersMap = usersWithImages.reduce((acc, currUser) => {
                acc[currUser.nick] = currUser;
                return acc;
            }, {} as { [key: string]: User });
            setUsersMap(usersMap);
            setUserInChannelsMap(usersMap);
        }

        const handleUpdateChannelLeave = async (newUserList: []) => {
            const usersWithImages = await Promise.all(newUserList.map(async (user: User) => {
                const imageUrl = await getUserImage(user.avatarUri);
                return { ...user, avatarFile: imageUrl ?? '' };
            }));
            const usersMap = usersWithImages.reduce((acc, currUser) => {
                acc[currUser.nick] = currUser;
                return acc;
            }, {} as { [key: string]: User });
            setUserInChannelsMap(usersMap);
        }

        const handleNewChannelMessages = async (msg: Message) => {
            setMessagesList(oldMessageList => [...oldMessageList, msg]);
        };


        fetchData();
        if (isFriendChat)
            socket?.on("NEW_DIRECT_MESSAGE", handleNewDirectMessages);
        else {
            socket?.on("NEW_CHANNEL_MESSAGE", handleNewChannelMessages);
            socket?.on("UPDATE_CHANNEL_USERS_LIST_JOIN", handleUpdateChannelJoin);
            socket?.on("UPDATE_CHANNEL_USERS_LIST_LEAVE", handleUpdateChannelLeave);
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
        left: '78%',
        position: 'relative',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    }

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

    const handleSend = async () => {
        if (selectedChat !== null) {
            if (message.trim() != '') {
                if (isFriendChat) {
                    const resp = await sendDirectMessage(selectedChat, message);
                    if (!resp)
                        handleNotification('El mensaje no se ha podido mandar');
                } else {
                    const resp = await sendChannelMessage(selectedChat, message);
                    if (!resp)
                        handleNotification('El mensaje no se ha podido mandar');
                }
                setMessage('');
            }
        }
    }

    const leaveChatChannel = async () => {
        const resp = await leaveChannel(selectedChat);
        if (resp)
            handleNotification('Has salido del canal')
        else
            handleNotification('No se ha podido salir del canal, puede que ya no exista!')
        setSelectedChat(null)
    }

    return (
        <div style={ChatWrapper}>
            <button style={BackArrowStyle} onClick={() => setSelectedChat(null)}>
                <IoMdArrowRoundBack size={26} color='grey' />
            </button>

            {!isFriendChat &&
                <button style={LeaveIconStyle} onClick={leaveChatChannel}>
                    <FaSignOutAlt size={26} color='grey' />
                </button>
            }
            <div style={MessagesContainerStyle}>
                {[...messagesList].reverse().map((messageItem, index) => {
                    const user = usersMap[messageItem.sender];
                    return (
                        <div key={index} style={MessageStyle}>
                            <img
                                src={usersMap[user?.nick]?.avatarFile}
                                alt={user?.nick}
                                style={UserImageStyle}
                                // as={Link}
                                // to="/settings"       CHANGE TO USER PROFILEPAGE
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            />
                            <div style={MessageInfoStyle}>
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
            <div style={TextAreaWrapperStyle}>
                <textarea
                    style={MessageInputStyle}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
            </div>
            <button style={SendButtonStyle} onClick={handleSend}>
                <IoMdSend size={26} />
            </button>
        </div>
    );

}
export default ChatDisplay;
