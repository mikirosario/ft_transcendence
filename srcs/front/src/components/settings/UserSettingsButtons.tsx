import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, deleteAvatarProfile } from '../../requests/User.Service';

interface Args {
	btnTxt: string
}

const UserSettingsButtons: React.FC<Args> = (args) => {
	const [username, setUsername] = useState('');
	const [image, setImage] = useState<File | null>(null);
	const [userImage, setUserImage] = useState<string>();
	const navigate = useNavigate();

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

	// ---------------------- INTERACTIONS -------------------------------

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
	  
		const success = await updateUserProfile(username, image);
	  
		if (success) {
		  navigate('/homepage');
		}
	  };

	const resetAvatar = async (event: React.FormEvent) => {
		event.preventDefault();

		const imageURL = await deleteAvatarProfile();
  
		if (imageURL) {
		  setUserImage(imageURL);
		}
	};

	useEffect(() => {
		const fetchUserProfile = async () => {
			const userProfile = await getUserProfile();
			setUsername(userProfile.username);
			setUserImage(userProfile.userImage);
		  };
		  
		  fetchUserProfile();
	}, []);

	// -------------------------- STYLES ---------------------------------

	const UsernameStyle: React.CSSProperties = {
		color: '#ffffff',
		fontFamily: "'Press Start 2P'",
		fontSize: '14px',
		fontWeight: 400,
		lineHeight: 'normal',
		position: 'relative',
		top: '42%',
		width: '0%',
		left: '4%',
	};

	const InputTextStyle: React.CSSProperties = {
		color: 'white',
		fontFamily: "'Press Start 2P'",
		fontSize: '12px',
		height: '5%',
		left: '33%',
		top: '36%',
		width: '60%',
		position: 'relative',
		border: 'none',
		borderBottom: '2px solid gray',
		background: 'transparent',
	};

	const SelectImageStyle: React.CSSProperties = {
		height: '175px',
		width: '175px',
		position: 'absolute',
		top: '16%',
		left: '18%',
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
		top: '80%',
		left: '45%',
		position: 'relative',
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
		fontSize: '16px',
		fontWeight: 'bold',
		border: 'none',
		borderRadius: '4px',
		padding: '10px 20px',
		cursor: 'pointer',
		width: '250px',
		marginTop: '46%',
		marginLeft: '35%',
		transition: 'opacity 0.3s',
	});

	const ImageWrapperStyle: React.CSSProperties = {
		height: '100%',
		width: '35%',
		left: '0%',
		position: 'absolute',
	};

	const TextWrapperStyle: React.CSSProperties = {
		height: '100%',
		width: '65%',
		left: '35%',
		position: 'absolute',
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<div style={TextWrapperStyle}>
					<div style={UsernameStyle}>
						Nickname:
					</div>
					<input
						type="text"
						value={username}
						style={InputTextStyle}
						placeholder='Enter your nick'
						onChange={handleUsernameChange}
					/>
					<button
						type="submit"
						style={ApplyButtonStyle}
						onMouseEnter={handleApplyButtonMouseEnter}
						onMouseLeave={handleApplyButtonMouseLeave}
					>
						{args.btnTxt}
					</button>
				</div>
				<div style={ImageWrapperStyle}>
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
							accept=".jpg,.png,.jpeg"
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
				</div>
			</form>
		</div>
	);
};

export default UserSettingsButtons;


