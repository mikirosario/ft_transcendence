// Friend.Service.tsx

import axiosClient from "../axiosClient";

export async function getFriendList(): Promise<{ friends: any[] }> {
  try {
    const response = await axiosClient.get('users/friends');

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

export async function addFriend(friendName: string): Promise<boolean> {
  try {
    const response = await axiosClient.post('users/friends', { nick: friendName });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Request failed with status ' + response.status);
    }

    return true;

  } catch (error) {
    console.log('Error: Could not add the friend', error);
    return false;
  }
}

export async function deleteFriend(friendName: string): Promise<boolean> {
  try {
    const response = await axiosClient.delete('users/friends', {
      data: { nick: friendName },
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

export async function getFriendRequests(): Promise<{ friends: any[] }> {
  try {
    const response = await axiosClient.get('users/friends/requests');

    const friendList = response.data;

    return { friends: friendList };

  } catch (error) {
    console.log('Error: Could not remove that friend', error);
    return  { friends: [] };
  }
}

export async function updateFriendList(friendName: string): Promise<boolean> {
  try {
    const response = await axiosClient.put('users/friends', { nick: friendName });

    if (response.status !== 200) {
      throw new Error('Request failed with status ' + response.status);
    }

    return true;

  } catch (error) {
    console.log('Error: Could not remove that friend', error);
    return false;
  }
}

// --------------------- Canales/Directos/Bloqueados --------------------------

export async function getBlockedUsers(): Promise<string[]> {
  try {
    const response = await axiosClient.get('chats');

    const { blocked_users } = response.data;
    return blocked_users;

  } catch (error) {
    console.log('Error: Could not remove that friend', error);
    return  [];
  }
}

export async function unblockUser(friendName: string): Promise<boolean> {
  try {
    const response = await axiosClient.delete('chat/blocks', {
      data: { nick: friendName },
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Request failed with status ' + response.status);
    }

    return true;

  } catch (error) {
    console.log('Error: Could not remove that user', error);
    return false;
  }
}
