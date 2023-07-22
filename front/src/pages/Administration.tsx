import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdSend } from 'react-icons/io';
import HomeButton from "../components/B_Home";
import SocialMenu from "../components/administration-menu/SocialAdminMenu";
import { sendAdminCommand } from '../requests/Admin.Service';
import NotificationContext from '../NotificationContext';
import SocialAdminMenu from '../components/administration-menu/SocialAdminMenu';
import { FaInfoCircle } from 'react-icons/fa';
import { SocketProvider1, SocketProvider2 } from "../SocketContext";


function Administration() {
    // const { handleNotification } = useContext(NotificationContext);
    const [messagesList, setMessagesList] = useState<String[]>([]);
    const [message, setMessage] = useState('');
    const [showCommands, setShowCommands] = useState(false);

    const toggleCommands = () => {
        setShowCommands(!showCommands);
    }


    const Window: React.CSSProperties = {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'absolute',
    }

    const AdministrationPanelStyle: React.CSSProperties = {
        position: 'absolute',
        top: '12%',
        left: '48%',
        fontSize: '28px',
        fontFamily: "'Press Start 2P'",
        color: 'grey',
        transform: 'translateX(-50%)',
        width: '50%'
    }

    const InfoCommandsIconStyle: React.CSSProperties = {
        top: '86.2%',
        left: '67.5%',
        position: 'absolute',
        cursor: 'pointer',
        background: 'transparent',
        border: 'none'
    }

    const HelpCommandPopUpStyle: React.CSSProperties = {
        position: 'absolute',
        top: '74%',
        left: '70%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(185, 180, 195, 0.9)',
        border: '1px solid #000',
        borderRadius: '10px',
        padding: '5px',
        width: '300px',
        zIndex: '1000'
    };

    const UnifiedContainerStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '6%',
        left: '42%',
        transform: 'translate(-50%, 0)',
        width: '50%',
        borderRadius: '15px',
        overflow: 'hidden',
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
        width: '100%',
        borderRadius: '15px',
        overflow: 'hidden',
    };

    const MessagesContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column-reverse',
        height: '60vh',
        width: '100vh',
        overflowY: 'auto',
        padding: '15px',
    };

    const MessageInputStyle: React.CSSProperties = {
        width: '100%',
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
        right: '8px',
        bottom: '6%',
        background: 'transparent',
        border: 'none',
        color: 'gray',
        cursor: 'pointer'
    }

    const MessageStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
        fontFamily: "Quantico",
        fontSize: '18px',
        marginTop: '6px',
        color: 'darkgray'
    };


    const handleSend = async () => {
        if (message.trim() != '') {

            const resp = await sendAdminCommand(message);

            const newMsg = message + ': ' + resp.msg;
            setMessagesList(oldMessagesList => {
                const newList = [...oldMessagesList, newMsg];

                if (newList.length > 10)
                    newList.shift();

                return newList;
            });
            setMessage('');
        }
    }

    return (
        <SocketProvider1>
            <SocketProvider2>
                <div style={Window}>
                    <HomeButton></HomeButton>
                    <SocialAdminMenu></SocialAdminMenu>
                    <h1 style={AdministrationPanelStyle}> Panel de Administracion</h1>
                    <button style={InfoCommandsIconStyle} onClick={toggleCommands}>
                        <FaInfoCircle size={24} color='grey' />
                    </button>

                    {showCommands && (
                        <div style={HelpCommandPopUpStyle}>
                            <h2>Lista de Comandos</h2>
                            <button style={CloseButtonStyle} onClick={toggleCommands}>X</button>
                            <ul>
                                <>
                                    <li style={{ fontSize: '14px' }}>/duel: Reta a un usuario a un Pong</li>
                                    <li style={{ fontSize: '14px' }}>/spectate: Comienza a observar la partida de un usuario</li>
                                    <li style={{ fontSize: '14px' }}>/block: Bloquea a un usuario</li>
                                </>
                            </ul>
                        </div>
                    )}
                    <div style={UnifiedContainerStyle}>
                        <div style={MessagesContainerStyle}>
                            {[...messagesList].reverse().map((messageItem, index) => (
                                <div key={index} style={MessageStyle}>
                                    {messageItem}
                                </div>
                            ))}
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
                            <button style={SendButtonStyle} onClick={handleSend}>
                                <IoMdSend size={26} />
                            </button>
                        </div>
                    </div>
                </div>
            </SocketProvider2>
        </SocketProvider1>
    )
}

export default Administration;
