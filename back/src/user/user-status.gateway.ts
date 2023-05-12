import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
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
	
	constructor(private userService: UserService) { }

	afterInit(server: any) {
		console.log('Esto se ejecuta cuando inicia')
	}
	
	
	handleConnection(client: any, ...args: any[]) {
		let auth_token: string = client.handshake.headers.authorization;
		let a = auth_token.split(" ")[1];
		console.log(a);

		this.userService.setUserOnline(1);
		
		console.log('Hola alguien se conecto al socket 👌👌👌');
	}
	
	handleDisconnect(client: any) {
		console.log('ALguien se fue! chao chao')
	}
	
	
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
}
