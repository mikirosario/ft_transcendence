import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { WebSocketService } from '../../auth/websocket/websocket.service';
import { Injectable } from '@nestjs/common';


@WebSocketGateway(8083, {
	cors: {
		origin: ['http://localhost:3001']
		// origin: '*'
	},
})
@Injectable()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private connectedUsers: Map<number, Socket[]> = new Map();
	
	constructor(private config: ConfigService, private userService: UserService,
		private webSocketService: WebSocketService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: any, ...args: any[]) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		try {
			const user = await this.userService.getUserById(userId);

			/*
			if (this.connectedUsers.has(user.id))
			{
				const mySocket = this.connectedUsers.get(user.id);
				mySocket.disconnect();
				this.connectedUsers.delete(user.id);
				console.log(this.connectedUsers);
			}

			console.log(this.connectedUsers.size);
			*/


			if (this.connectedUsers.has(user.id))
			{
				const sockets: Socket[] = this.connectedUsers.get(user.id);
				this.connectedUsers.set(user.id, [...sockets, client]);

				console.log('Hola! ' + user.nick + ' está en el chat (' + sockets.length + ' conex) 💬✅');
			} else {
				console.log('Hola! ' + user.nick + ' está en el chat 💬✅');
				this.connectedUsers.set(user.id, [client]);
			}

			console.log("Usuarios conectados al chat: " +this.connectedUsers.size);

		} catch (error) {
			client.disconnect();
			return;
		}
	}
	
	async handleDisconnect(client: any) {

		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (!userId)
		{
			console.log('Alguien se ha ido del chat 💬❌');
			client.disconnect();
			return ;
		}

		try {
			const user = await this.userService.getUserById(userId);

			if (this.connectedUsers.has(user.id))
			{
				const sockets: Socket[] = this.connectedUsers.get(user.id);

				const newSockets = sockets.filter((value) => value !== client);
				this.connectedUsers.set(user.id, newSockets);
				client.disconnect();
			}

			if (!user)
				console.log(userId + ' se ha ido del chat 💬❌');
			else
				console.log(user.nick + ' se ha ido del chat 💬❌');

		} catch (error) {
			client.disconnect();
		}
	}

	joinRoom(userId: number, room: string) {
		const userSockets: Socket[] = this.connectedUsers.get(userId);

		for (const socket of userSockets) {
			socket.join("room_" + room);
		}
	}

	leaveRoom(userId: number, room: string) {
		const userSockets: Socket[] = this.connectedUsers.get(userId);

		for (const socket of userSockets) {
			socket.leave("room_" + room);
		}
	}

	async sendSocketMessageToRoom(room: string, eventName: string, data: any) {
		this.server.to("room_" + room).emit(eventName, data);
	}

	async sendSocketMessageToUser(userId: number, eventName: string, data: any) {
		const userSockets: Socket[] = this.connectedUsers.get(userId);

		for (const socket of userSockets) {
			socket.emit(eventName, data);
		}
	}

	async sendSocketMessageToAll(eventName: string, data: any) {
		this.server.emit(eventName, data);
	}

	/*
	async sendSocketMessageToRoom(room: string, eventName: string, data: any) {
		this.server.to(`room_${room}`).emit(eventName, data);
	}
	*/

	/*
	@SubscribeMessage('event_join')
	handleJoinRoom(client: Socket, room: string) {
		client.join(`room_${room}`);
	}
	
	@SubscribeMessage('event_leave')
	handleRoomLeave(client: Socket, room:string) {
		console.log(`chao room_${room}`)
		client.leave(`room_${room}`);
	}
	*/

	/*
	@SubscribeMessage('event_message') //TODO Backend
	handleIncommingMessage(client: Socket, payload: { room: string; message: string }) {
		const { room, message } = payload;

		console.log(payload)

		this.server.to(`room_${room}`).emit('new_message', message);
	}
	*/
	
}
