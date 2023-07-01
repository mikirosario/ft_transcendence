import axios from "axios";

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

export async function getChannelList() {
    try {
        const response = await axios.get('chats', {
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        });

        const { channels } = response.data;
        return channels;

    } catch (error) {
        console.log('Error: Could not remove that friend', error);
        return [];
    }
}

export async function createChannel(channelName: string, password: string) {
    try {
      const response = await axios.post('/chat/channels', { 
        name: channelName, 
        password: password 
      }, {
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
      console.log('Error: Could not create the channel', error);
      return false;
    }
  }
export async function joinChannel(channelName: string, password: string) {

}