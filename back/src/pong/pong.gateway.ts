import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { WebSocketService } from '../auth/websocket/websocket.service';
import { Console } from 'console';

@WebSocketGateway(8082, {
	cors: {
		origin: ['http://localhost:3001']
		//origin: '*'
	},
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	constructor(private config: ConfigService, private userService: UserService, private webSocketService: WebSocketService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: any, ...args: any[]) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		// if (userId == null)
		// {
		// 	console.log("No UserID found");
		// 	client.disconnect();
		// 	return;
		// }


		// const user = await this.userService.setUserInGame(userId, true);
		// if (user == null)
		// {
		// 	client.disconnect();
		// 	return;
		// }

		// console.log('Hola! ' + user.nick + ' está jugando ✅');
		console.log('Hola estoy jugando!');
	}
	
	async handleDisconnect(client: any) {
		const userId = this.webSocketService.getUserIdFromHeaders(client.handshake.headers);
		if (userId == null)
		{
			client.disconnect();
			return;
		}

		const user = await this.userService.setUserInGame(userId, false);
		if (user == null)
		{
			client.disconnect();
			return;
		}
		
		console.log(user.nick + ' ha salido del juego ❌');
	}
}
