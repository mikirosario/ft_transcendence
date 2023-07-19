import React, { useContext, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import HomeButton from "../components/B_Home";
import { useNavigate } from 'react-router-dom';
import NotificationContext from '../NotificationContext';

interface Message {
    sender: string,
    sentAt: string,
    message: string,
};

function Administration() {
    const { handleNotification } = useContext(NotificationContext);
    const [messagesList, setMessagesList] = useState<Message[]>([]);
    const [message, setMessage] = useState('');

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
        right: '190px',
        bottom: '7.5%',
        background: 'transparent',
        border: 'none',
        color: 'gray',
        cursor: 'pointer'
    }

    // Message List Style

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



    const handleSend = async () => {
        if (message.trim() != '') {

            // const resp = await sendDirectMessage(message);
            // if (!resp)
            // handleNotification('El mensaje no se ha podido mandar');

            setMessage('');
        }
    }

    return (
        <div style={MessagesContainerStyle}>
            <HomeButton></HomeButton>
            {/* <div key={index} style={MessageStyle}>
                Aqui deberia ir un mapa para recorrer el historial de operaciones tal que devolver la lista de usuarios/admins/lista de canales si se desea
                o en vez de usar el NotificationContext para anunciar los cambios, tambien se podria poner aqui
            </div> */}
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

    )
}

export default Administration;
