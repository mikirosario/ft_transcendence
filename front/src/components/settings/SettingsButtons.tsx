import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const OptionsButton: React.FC = () => {
	const [username, setUsername] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [name, setName] = useState('');
	const [userImage, setUserImage] = useState<string>();

	const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	};

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedImage = event.target.files[0];
			setImage(selectedImage);
			const imageURL = URL.createObjectURL(selectedImage); // Create URL for the selected image
			setUserImage(imageURL); // Set the userImage state with the URL
		}
	};


	const handleImageMouseEnter = () => {
		setImageStyle({ ...ImageStyle, opacity: 0.5 });
	};

	const handleImageMouseLeave = () => {
		setImageStyle({ ...ImageStyle, opacity: 1 });
	};

	const handleApplyButtonMouseEnter = () => {
		setApplyButtonStyle({ ...ApplyButtonStyle, opacity: 0.7 }); 
	};

	const handleApplyButtonMouseLeave = () => {
		setApplyButtonStyle({ ...ApplyButtonStyle, opacity: 1 });
	};

	const handleTrashMouseEnter = () => {
		setTrashIconStyle({ ...TrashIconStyle, opacity: 0.75 });
	};

	const handleTrashMouseLeave = () => {
		setTrashIconStyle({ ...TrashIconStyle, opacity: 1 });
	};



	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const formData = new FormData();
		formData.append('nick', username);
		if (image) {
			formData.append('file', image);
		}

		try {
			const response = await fetch('http://localhost:3000/users/profile', {
				method: 'PUT',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
				body: formData,
			});

			if (response.ok) {
				console.log('Changes applied successfully');
			} else {
				console.log('Failed to apply changes');
			}
		} catch (error) {
			console.log('Error:', error);
		}
	};

	const resetAvatar = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3000/users/profile', {
				method: 'DELETE',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'), 
				},
			});


			if (response.ok) {
				console.log('Avatar deleted successfully');
			} else {
				console.log('Failed to delete avatar');
			}
			const data = await response.json();
			const fetchedImage = data.avatarUri;
			const imageResponse = await fetch('http://localhost:3000/uploads/avatars/' + fetchedImage, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			});
			if (!imageResponse.ok) {
				throw new Error('Request failed with status ' + imageResponse.status);
			}
			const imageBlob = await imageResponse.blob();

			const imageURL = URL.createObjectURL(imageBlob);
			setUserImage(imageURL);
		} catch (error) {
			console.log('Error:', error);
		}
	};


	const getUserRequest = async () => {
		try {
			const response = await fetch('http://localhost:3000/users/profile', {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			});
			if (!response.ok) {
				throw new Error('Request failed with status ' + response.status);
			}
			const data = await response.json();
			const fetchedName = data.nick;
			const fetchedImage = data.avatarUri;

			if (!name) {
				setName(fetchedName);
				setUsername(fetchedName); 
			}

			const imageResponse = await fetch('http://localhost:3000/uploads/avatars/' + fetchedImage, {
				method: 'GET',
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('token'),
				},
			});
			if (!imageResponse.ok) {
				throw new Error('Request failed with status ' + imageResponse.status);
			}
			const imageBlob = await imageResponse.blob();

			const imageURL = URL.createObjectURL(imageBlob);
			setUserImage(imageURL);
		} catch (error) {
			console.log('Error:', error);
		}
	};

	useEffect(() => {
		getUserRequest();
	}, []);

	// -------------------------- STYLES -----------------------------------

	const UsernameStyle: React.CSSProperties = {
		color: '#ffffff',
		fontFamily: "'Press Start 2P'",
		fontSize: '12px',
		fontWeight: 400,
		height: '40px',
		lineHeight: 'normal',
		position: 'absolute',
		textAlign: 'center',
		top: '-80px',
		width: '100%',
		left: '10%',
		transform: 'translateX(-50%)',
	};


	const InputTextStyle: React.CSSProperties = {
		color: 'white',
		fontFamily: "'Press Start 2P'",
		height: '25px',
		left: '210px',
		position: 'absolute',
		top: '-10px',
		width: '350px',
		border: 'none',
		borderBottom: '2px solid gray',
		background: 'transparent',
	};

	const SelectImageStyle: React.CSSProperties = {
		height: '175px',
		width: '175px',
		position: 'absolute',
		top: '-160px',
		left: '-205px',
		borderRadius: '50%',
	};

	const ButtonStyle: React.CSSProperties = {
		height: '100%',
		width: '100%',
		position: 'absolute',
		top: '0',
		left: '-10px',
		borderRadius: '50%',
		opacity: 0,
	};

	const [ImageStyle, setImageStyle] = useState<React.CSSProperties>({
		height: '100%',
		width: '100%',
		position: 'relative',
		top: '0',
		left: '-10px',
		borderRadius: '50%',
		transition: 'opacity 0.3s',
		cursor: 'pointer',
	});

	const [TrashIconStyle, setTrashIconStyle] = useState<React.CSSProperties>({
		color: '#bf2222',
		position: 'absolute',
		top: '35px',
		left: '-140px',
		background: 'transparent',
		scale: '2.0',
		border: 'none',
		borderRadius: '50%',
		transition: 'opacity 0.3s',
		cursor: 'pointer',
	});

	const [ApplyButtonStyle, setApplyButtonStyle] = useState<React.CSSProperties>({
		backgroundColor: '#5b8731',
		color: '#FFFFFF',
		fontFamily: "'Press Start 2P'",
		fontSize: '18px',
		fontWeight: 'bold',
		border: 'none',
		borderRadius: '4px',
		padding: '10px 20px',
		cursor: 'pointer',
		width: '300px',
		marginTop: '20px',
		marginLeft: '120px',
		transition: 'opacity 0.3s',
	});



	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div className="NicknameTitle" style={UsernameStyle}>
					Username:
					<input
						type="text"
						value={username}
						onChange={handleUsernameChange}
						style={InputTextStyle}
					/>
				</div>
				<button type="button"
					onClick={resetAvatar}
					style={TrashIconStyle}
					onMouseEnter={handleTrashMouseEnter}
					onMouseLeave={handleTrashMouseLeave}
				>
					<FaTrash />
				</button>
				<label htmlFor="image" style={SelectImageStyle}>
					<input
						type="file"
						id="image"
						accept=".jpg,.png"
						onChange={handleImageChange}
						style={ButtonStyle}
					/>
					<img
						src={userImage}
						alt=""
						style={ImageStyle}
						onMouseEnter={handleImageMouseEnter}
						onMouseLeave={handleImageMouseLeave}
					/>
				</label>
				<div>
					<button
						type="submit"
						style={ApplyButtonStyle}
						onMouseEnter={handleApplyButtonMouseEnter}
						onMouseLeave={handleApplyButtonMouseLeave}
					>
						Apply Changes
					</button>
				</div>
			</form>
		</div>
	);
};

export default OptionsButton;


