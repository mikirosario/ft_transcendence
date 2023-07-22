import axiosClient from "../axiosClient";

export async function getChatDirect(chatId: number): Promise<any> {
    try {
        const response = await axiosClient.get('/chat/directs?userId=' + chatId);

        return response.data;

    } catch (error) {
        console.log('User does not exist ', error);
        return [];
    }
}

export async function sendDirectMessage(id: number, content: string): Promise<boolean> {
    try {
        const response = await axiosClient.post('/chat/directs/message', {
            user_id: id,
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

// -------------------- CHANNEL ---------------------------

export async function getChatChannel(chatId: number): Promise<any> {
    try {
        const response = await axiosClient.get('/chat/channels?channelId=' + chatId);

        return response.data;

    } catch (error) {
        console.log('Error: Could not remove that friend', error);
        return [];
    }
}

export async function sendChannelMessage(id: number, content: string): Promise<boolean> {
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
