// Channel.Service.tsx

import axiosClient from "../axiosClient";

export async function getChannelList(): Promise<string[]> {
  try {
    const response = await axiosClient.get('/chats/');

    const { channels } = response.data;
    return channels;

  } catch (error) {
    console.log('Error: Could not remove that friend', error);
    return [];
  }
}

export async function createChannel(channelName: string, password: string): Promise<boolean> {
  try {
    const response = await axiosClient.post('/chat/channels', {
      name: channelName,
      password: password
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

export async function editChannel(id: number, newChannelName: string, newPassword: string): Promise<boolean> {
  try {
    const response = await axiosClient.put('/chat/channels', {
      id: id,
      name: newChannelName,
      password: newPassword
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

export async function deleteChannel(id: number, password: string): Promise<boolean> {
  try {
    const response = await axiosClient.delete('/chat/channels', {
      data: {
          id: id,
          password: password
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

export async function joinChannel(name: string, password: string): Promise<boolean> {
  try {
    const response = await axiosClient.post('/chat/channels/join', {
      name: name,
      password: password
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

export async function leaveChannel(id: number): Promise<boolean> {
  try {
    const response = await axiosClient.delete('/chat/channels/leave', {
      data: {
          id: id
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

export async function editPermsChannel(id: number, name: string, setOwner: boolean, setAdmin: boolean): Promise<boolean> {
  try {
    const response = await axiosClient.put('/chat/channels/users', {
      data: {
          id: id,
          user_id: name,
          isOwner: setOwner,
          isAdmin: setAdmin
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

export async function sendDirectMessage(id: number, content: string): Promise<boolean> {
  try {
      const response = await axiosClient.post('/chat/channels/message', {
          channel_id: id,
          message: content
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

export async function modChannel(id: number, name: string, setBan: boolean, setMute: number): Promise<boolean> {
  try {
    const response = await axiosClient.put('/chat/channels/leave', {
      data: {
          id: id,
          user_id: name,
          isBanned: setBan,
          isMuteSecs: setMute
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

// 2 ultimos post y delete ?