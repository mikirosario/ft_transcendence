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
import { Pong } from './pong';
import { InputState } from './types';

@WebSocketGateway(8082, {
	cors: {
		origin: ['http://localhost:3001']
		//origin: '*'
	},
})
export class PongGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer() server: Server;

	private games: Map<string, Pong> = new Map();

	constructor(private config: ConfigService, private userService: UserService, private webSocketService: WebSocketService) { }

	afterInit(server: any) { }
	
	async handleConnection(client: Socket, ...args: any[]) {
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
		const pongBackend = new Pong();
		this.games.set(client.id, pongBackend)
		client.join(client.id);
		console.log('Hola estoy jugando!');
		setInterval(() => {
			//Set the game state for the next frame
			pongBackend.setGameState();
			//Emit game state to all clients in room
			this.server.to(client.id).emit('gameState', pongBackend.getGameState());
			//console.log("Game State Sent");
		}, 1000 / 60); // 60 times a second
		client.on('input', (input: InputState) => {
			// Update paddle direction based on input
			pongBackend.applyRemoteInputs(input, input);
			console.log("Input");
		  });
	}
	
	async handleDisconnect(client: Socket) {
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
