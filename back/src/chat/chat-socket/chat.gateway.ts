import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from "@nestjs/config";
import { UserService } from "../../user/user.service";
import { WebSocketService } from '../../auth/websocket/websocket.service';


@WebSocketGateway(8083, {
	cors: {
		origin: ['http://localhost:3001']
		// origin: '*'
	},
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private connectedUsers: { [key: string]: Socket } = {};
	
	constructor(private config: ConfigService, private userService: UserService, private webSocketService: WebSocketService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: any, ...args: any[]) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		const user = await this.userService.getUserById(userId);
		if (user == null)
		{
			client.disconnect();
			return;
		}

		this.connectedUsers[user.id] = client;

		this.sendSocketMessage(user.id, "ID_A", "hey");

		console.log('Hola! ' + user.nick + ' está en el chat 💬✅');
	}
	
	async handleDisconnect(client: any) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		const user = await this.userService.getUserById(userId);
		if (user == null)
		{
			client.disconnect();
			return;
		}

		delete this.connectedUsers[user.id];
		
		console.log(user.nick + ' está se ha ido del chat 💬❌');
	}

	/*
	@SubscribeMessage('event_join')
	handleJoinRoom(client: Socket, room: string) {
		client.join(`room_${room}`);
	}
	
	@SubscribeMessage('event_message') //TODO Backend
	handleIncommingMessage(client: Socket, payload: { room: string; message: string }) {
		const { room, message } = payload;

		console.log(payload)

		this.server.to(`room_${room}`).emit('new_message', message);
	}
	
	@SubscribeMessage('event_leave')
	handleRoomLeave(client: Socket, room:string) {
		console.log(`chao room_${room}`)
		client.leave(`room_${room}`);
	}
	*/

	async sendSocketMessage(userId: number, eventName: string, data: any) {
		const userSocket = this.connectedUsers[userId];

		if (userSocket) {
			userSocket.emit(eventName, data);
		}
	}
}
