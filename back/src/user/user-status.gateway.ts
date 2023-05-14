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
	
	handleConnection(client: any, ...args: any[]) {
		/* Extraer JWT */
		const jwtToken = this.extractTokenFromHeaders(client.handshake.headers);
		console.log(jwtToken);

		if (!jwtToken)
		{
			// Token is missing, close the connection
			client.disconnect();
			return;
		}

		try {
			const decoded = verify(jwtToken, this.config.get('JWT_SECRET'));
			const userId = Number(decoded.sub)
			const user = this.userService.getUser(userId);
			if (!user) {
				// Invalid user, close the connection
				client.disconnect();
				return;
			}
			this.userService.setUserStatus(userId, 'online');
		} catch (error) {
			// Invalid token, close the connection
			client.disconnect();
		}

		console.log('Hola! alguien se conecto al socket 👌👌👌');
	}
	
	handleDisconnect(client: any) {
		// Extraer JWT
		const jwtToken = this.extractTokenFromHeaders(client.handshake.headers);
		console.log(jwtToken);
		
		// Comprobar si JWT es valido
		if (!jwtToken)
		{
			// Token is missing, close the connection
			client.disconnect();
			return;
		}

		try {
			const decoded = verify(jwtToken, this.config.get('JWT_SECRET'));
			const userId = Number(decoded.sub)
			const user = this.userService.getUser(userId);
			if (!user) {
				// Invalid user, close the connection
				client.disconnect();
				return;
			}
			this.userService.setUserStatus(userId, 'offline');
		} catch (error) {
			// Invalid token, close the connection
			client.disconnect();
		}

		console.log('ALguien se fue! chao chao')
	}

	private extractTokenFromHeaders(headers: any): string | null {
		const auth_token: string = headers.authorization.split(" ")[1];
		
		return (auth_token);
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
