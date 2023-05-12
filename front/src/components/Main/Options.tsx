import React, { useState } from 'react';

const OptionsButton: React.FC = () => {

    const [username, setUsername] = useState('');
    const [image, setImage] = useState<File | null>(null);
  
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
            Authorization: 'Bearer ' + localStorage.getItem('token'), // Replace 'jwt' with your actual JWT token
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
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" accept=".jpg,.png" onChange={handleImageChange} />
        </div>
        <button type="submit">Apply Changes</button>
      </form>
    );
  }
export default OptionsButton;
