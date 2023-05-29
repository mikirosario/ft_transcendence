import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


export async function updateUserProfile(username: string, image: File | null) {
  const formData = new FormData();
  formData.append('nick', username);
  if (image) {
    formData.append('file', image);
  }

  try {
    const response = await axios.put('/users/profile', formData);

    if (response.status === 200) {
      console.log('Changes applied successfully');
      return true;
    } else {
      console.log('Failed to apply changes');
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

export async function getUserProfile() {
  try {
    const response = await axios.get('/users/profile');

    if (response.status !== 200) {
      throw new Error('Request failed with status ' + response.status);
    }

    const fetchedName = response.data.nick;
    let fetchedImage = response.data.avatarUri;

    let imageResponse;

    if (fetchedImage.includes('https://cdn.intra.42.fr/users/')) {

      
      const authorization = axios.defaults.headers.common["Authorization"];
      delete axios.defaults.headers.common["Authorization"];

      imageResponse = await axios.get(fetchedImage, {
        responseType: 'blob',
        headers: {
          'Accept': 'image/avif,image/webp,image/apng'
        },
      });

      axios.defaults.headers.common["Authorization"] = authorization;
      
    } else {
      
      fetchedImage = '/uploads/avatars/' + fetchedImage;
      imageResponse = await axios.get(fetchedImage, {
        responseType: 'blob',
      });
    }

    if (imageResponse.status !== 200) {
      throw new Error('Request failed with status ' + imageResponse.status);
    }

    const imageURL = URL.createObjectURL(imageResponse.data);

    return { username: fetchedName, userImage: imageURL };

  } catch (error) {
    console.log('Error:', error);
    return { username: "", userImage: "" };
  }
}

export async function deleteAvatarProfile() {
  try {
    const response = await axios.delete('users/profile');

    if (response.status !== 200) {
      console.log('Failed to delete avatar');
      return null;
    }

    console.log('Avatar deleted successfully');
    const fetchedImage = response.data.avatarUri;

    const imageResponse = await axios.get('uploads/avatars/' + fetchedImage, {
      responseType: 'blob',
    });

    if (imageResponse.status !== 200) {
      throw new Error('Request failed with status ' + imageResponse.status);
    }

    const imageURL = URL.createObjectURL(imageResponse.data);

    return imageURL;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
