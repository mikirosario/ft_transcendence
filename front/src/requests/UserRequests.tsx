import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


export const updateProfile = async () => {
    const username = "";
    const image = 0;

    const formData = new FormData();
    formData.append('nick', username);
    if (image) {
        formData.append('file', image);
    }

    try {
        const response = await axios.put('/users/profile', formData);

        if (response.status == 200) {
            console.log('Changes applied successfully');
            // navigate('/homepage');							// TEST
        } else {
            console.log('Failed to apply changes');
        }
    } catch (error) {
        console.log('Error:', error);
    }
};