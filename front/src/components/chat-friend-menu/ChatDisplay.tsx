import React, { useEffect, useState } from 'react';
import { IoMdArrowRoundBack, IoMdSend } from 'react-icons/io';

function ChatDisplay({ selectedChat, setSelectedChat }: { selectedChat: string | null, setSelectedChat: (chat: string | null) => void }) {
    const [message, setMessage] = useState('');

    const ChatWrapper: React.CSSProperties = {
        height: '80vh',
        width: '20vw',
        top: '0%',
        left: '80%',
        position: 'absolute',
        // background: 'purple'
    };

    const BackArrowStyle: React.CSSProperties = {
        top: '1%',
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

    const handleSend = () => {
        console.log(message);
        // Aquí debes implementar el envío del mensaje
        setMessage('');
    }

    return (
        <div style={ChatWrapper}>
            <button style={BackArrowStyle} onClick={() => setSelectedChat(null)}>
                <IoMdArrowRoundBack size={26} color='grey' />
            </button>
            <div style={TextAreaWrapperStyle}>
                <textarea 
                    style={MessageInputStyle} 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Escribe un mensaje"
                />
            </div>
            <button style={SendButtonStyle} onClick={handleSend}>
                <IoMdSend size={26} />
            </button>
        </div>
    );
}

export default ChatDisplay;
