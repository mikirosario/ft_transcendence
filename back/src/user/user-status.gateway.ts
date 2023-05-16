import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { ConfigService } from "@nestjs/config";
import { UserService } from "./user.service";

@WebSocketGateway(8081, {
	cors: {
		origin: ['http://localhost:3001']
		// origin: '*'
	},
})
export class UserGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;
	
	constructor(private config: ConfigService, private userService: UserService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: any, ...args: any[]) {
		const jwtToken = this.extractTokenFromHeaders(client.handshake.headers);

		const userId = this.getUserIdFromToken(client, jwtToken);
		if (userId == null)
			return;

		const user = await this.userService.setUserStatus(userId, 'online');
		console.log('Hola! ' + user.nick + ' está online ✅');
	}
	
	async handleDisconnect(client: any) {
		const jwtToken = this.extractTokenFromHeaders(client.handshake.headers);
		
		const userId = this.getUserIdFromToken(client, jwtToken);
		if (userId == null)
			return;

		const user = await this.userService.setUserStatus(userId, 'offline');
		console.log(user.nick + ' está offline ❌');
	}

	private extractTokenFromHeaders(headers: any): string | null {
		const auth_token: string = headers.authorization.split(" ")[1];
		
		return (auth_token);
	}

	private getUserIdFromToken(client: any, jwtToken: string) {
		if (!jwtToken) // Token is missing, close the connection
		{
			client.disconnect();
			return null;
		}

		try {
			const decoded = verify(jwtToken, this.config.get('JWT_SECRET'));
			const userId = Number(decoded.sub);
			
			if (!this.userService.doesUserExit(userId)) { // Invalid user, close the connection
				client.disconnect();
				return null;
			}
			return userId;
		} catch (error) { // Invalid token, close the connection
			client.disconnect();
			return null;
		}
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
