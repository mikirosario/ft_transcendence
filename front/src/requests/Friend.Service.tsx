import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

export async function getFriendList() {
    try {
        const response = await axios.get('/friends', {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200) {
            throw new Error('Request failed with status ' + response.status);
        }

        // MIRAR
        const friendList = response.data.list;

        return { friends: friendList };

    } catch (error) {
        console.log('Error:', error);
        return { friends: "", };
    }
}

export async function addFriend(friendName: string) {
    try {
        const response = await axios.get('/friends/' + friendName, {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200) {
            throw new Error('Request failed with status ' + response.status);
        }

        // MIRAR
        const friendList = response.data.list;

        return { friends: friendList };

    } catch (error) {
        console.log('Error:', error);
        return { friends: "", };
    }
}