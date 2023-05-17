import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { BiSend } from 'react-icons/bi';
import defaultIMG from '../assets/images/default.jpg'

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const ConfirmUserLink = () => {
        // Makes the fetch action to check if the user is valid 

        // window.location.href = 'xxxx'; // Auth URL
        // navigate('/homepage');
    };


	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedImage = event.target.files[0];
			setImage(selectedImage);
		}
	};

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('nick', username);
        if (image) {
            formData.append('file', image);
        }

        try {
            // Make an HTTP request to the backend with the form data
            const response = await fetch('http://localhost:3000/users/profile', {
                method: 'PUT',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
                body: formData,
            });

            // Handle the response as needed
            if (response.ok) {
                console.log('Changes applied successfully');
            } else {
                console.log('Failed to apply changes');
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const NicknamePositionStyle: React.CSSProperties = {
        height: '320px',
        width: '100%',
        top: '320px',
        backgroundColor: '#01624',
        display: 'flex',
        justifyContent: 'center',
    };

    const NicknameTapeStyle: React.CSSProperties = {
        height: '100%',
        width: '100%',
        top: '260px',
        backgroundColor: '#1c2c49',
        position: 'relative',
    };

    const TitleStyle: React.CSSProperties = {
        color: '#ffffff',
        fontFamily: "'Press Start 2P'",
        fontSize: '40px',
        fontWeight: 400,
        height: '40px',
        lineHeight: 'normal',
        position: 'absolute',
        textAlign: 'center',
        top: '50px',
        whiteSpace: 'nowrap',
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const SubtitleStyle: React.CSSProperties = {
        color: '#ffffff',
        fontFamily: "'Press Start 2P'",
        fontSize: '20px',
        fontWeight: 400,
        height: '48px',
        lineHeight: 'normal',
        position: 'absolute',
        textAlign: 'center',
        top: '120px',
        width: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
    };

    const NicknameInputStyle: React.CSSProperties = {
        height: '74px',
        left: '50%',
        position: 'absolute',
        top: '220px',
        width: '80%',
        maxWidth: '593px',
        transform: 'translateX(-50%)',
    };

    const ImageStyle: React.CSSProperties = {
        height: '75px',
        left: '-20px',
        position: 'absolute',
        top: '-22px',
        width: '75px',
        borderRadius: '50%',
    };

    const InputTextStyle: React.CSSProperties = {
        color: 'white',
        fontFamily: "'Press Start 2P'",
        height: '25px',
        left: '75px',
        position: 'absolute',
        top: '20px',
        width: '475px',
        border: 'none',
        borderBottom: '2px solid gray',
        background: 'transparent',
    };


    const SendButtonStyle: React.CSSProperties = {
        color: 'white',
        fontSize: '25px',
        cursor: 'pointer',
        position: 'absolute',
        top: '21px',
        right: '10px',
    };

    return (
        <div className="NicknamePositionWrapper" style={NicknamePositionStyle}>
            <div className="NicknameTapeWrapper" style={NicknameTapeStyle}>
                <div className="NicknameTitle" style={TitleStyle}>
                    CHOOSE A NICKNAME
                </div>
                <div className="NicknameSubtitle" style={SubtitleStyle}>
                    Nick rules
                </div>
                <form onClick={handleSubmit}>
                    <div className="NicknameInputWrapper" style={NicknameInputStyle}>
                        <img
                            className="NicknameImage"
                            alt="default"
                            src={defaultIMG}
                            style={ImageStyle}
                        // Onclick Tag to set an image
                        />
                        <input
                            type="text"
                            placeholder="Enter your nickname"
                            style={InputTextStyle}
                            onChange={handleUsernameChange}
                        />
                        <BiSend
                            className="SendButton"
                            style={SendButtonStyle}
                            onClick={ConfirmUserLink}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
