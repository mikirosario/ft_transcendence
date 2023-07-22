import axiosClient from "../axiosClient";

export async function updateUserProfile(username: string, image: File | null): Promise<boolean> {
  const formData = new FormData();
  formData.append('nick', username);
  if (image) {
    formData.append('file', image);
  }

  try {
    const response = await axiosClient.put('/users/profile', formData);

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
}

export async function getUserProfile(): Promise<{ username: string; userImage: string }> {
  try {
    const response = await axiosClient.get('users/profile');

    if (response.status !== 200) {
      throw new Error('Request failed with status ' + response.status);
    }

    const fetchedName = response.data.nick;
    let fetchedImage = response.data.avatarUri;

    let imageResponse;

    if (fetchedImage.includes('https://cdn.intra.42.fr/users/')) {
      // Handle the case when the image URI is from an external CDN
      // In server-side rendering, the server won't access this block
      imageResponse = await axiosClient.get(fetchedImage, {
        responseType: 'blob',
        headers: {
          'Accept': 'image/avif,image/webp,image/apng'
        },
      });
    } else {
      // Handle the case when the image URI is local to your server
      fetchedImage = '/uploads/avatars/' + fetchedImage;
      imageResponse = await axiosClient.get(fetchedImage, {
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

export async function deleteAvatarProfile(): Promise<string | null> {
  try {
    const response = await axiosClient.delete('users/profile');

    if (response.status !== 200) {
      console.log('Failed to delete avatar');
      return null;
    }

    console.log('Avatar deleted successfully');
    const fetchedImage = response.data.avatarUri;

    const imageResponse = await axiosClient.get('uploads/avatars/' + fetchedImage, {
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

export async function getUserImage(URI: string): Promise<string | null> {
  try {
    let fetchedImage = URI;

    let imageResponse;

    if (fetchedImage.includes('https://cdn.intra.42.fr/users/')) {
      // This block won't be executed on the server-side
      // Use a different approach for server-side image fetching
      // Since there's no direct server access to this URL, return null
      return null;
    } else {
      fetchedImage = '/uploads/avatars/' + fetchedImage;
      imageResponse = await axiosClient.get(fetchedImage, {
        responseType: 'blob',
      });
    }

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
