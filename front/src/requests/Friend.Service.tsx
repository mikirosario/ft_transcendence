import axios from "axios";
import { getUserImage } from "./User.Service";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

// Obtiene la solicitud de los amigos
export async function getFriendList() {
    try {
        const response = await axios.get('users/friends', {
            headers: {
                responseType: 'json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200) {
            throw new Error('Request failed with status ' + response.status);
        }

        const friendList = response.data;

        return { friends: friendList };

    } catch (error) {
        console.log('Error:', error);
        return { friends: [] };
    }
}

// Manda la solicitud de amigo
export async function addFriend(friendName: string) {
    try {
        const response = await axios.post('users/friends', { nick: friendName }, {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Request failed with status ' + response.status);
        }

        return true;

    } catch (error) {
        console.log('Error: Could not add the friend', error);
        return false;
    }
}

// Borra a un amigo
export async function deleteFriend(friendName: string) {
    try {
        const response = await axios.delete('users/friends', {
            data: { nick: friendName },
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200 && response.status !== 201) {
            throw new Error('Request failed with status ' + response.status);
        }

        return true;

    } catch (error) {
        console.log('Error: Could not remove that friend', error);
        return false;
    }
}

// ----------------- PETICIONES AMIGO ------------------------------------

// Obtiene la lista de solicitudes de amigo
export async function getFriendRequests() {
    try {
        const response = await axios.get('users/friends/requests', {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const friendList = response.data;

        return { friends: friendList };

    } catch (error) {
        console.log('Error: Could not remove that friend', error);
        return  { friends: [] };
    }
}

// Accepta la request de friendName
export async function updateFriendList(friendName: string) {
    try {
        const response = await axios.put('users/friends', { nick: friendName }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        if (response.status !== 200) {
            throw new Error('Request failed with status ' + response.status);
        }

        return true;

    } catch (error) {
        console.log('Error: Could not remove that friend', error);
        return false;
    }
}