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
import { UserService } from "./user.service";
import { WebSocketService } from '../auth/websocket/websocket.service';

@WebSocketGateway(8081, {
	cors: {
		origin: ['http://localhost:3001']
		// origin: '*'
	},
})
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	
	constructor(private config: ConfigService, private userService: UserService, private webSocketService: WebSocketService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: any, ...args: any[]) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		const user = await this.userService.setUserStatus(userId, true);
		if (user == null)
		{
			client.disconnect();
			return;
		}

		console.log('Hola! ' + user.nick + ' está online ✅');
	}
	
	async handleDisconnect(client: any) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		const user = await this.userService.setUserStatus(userId, false);
		if (user == null)
		{
			client.disconnect();
			return;
		}
		
		console.log(user.nick + ' está offline ❌');
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
}
