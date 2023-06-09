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
import { Queue } from './queue';
import { Player, PlayerID } from './player';

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
	private waitingClients: Queue<Socket> = new Queue();

	constructor(private config: ConfigService, private userService: UserService, private webSocketService: WebSocketService) { }

	afterInit(server: any) { }

	matchPlayersAny()
	{
		// Spawn new games until queued clients come down to 1
		while (this.waitingClients.length > 1)
		{
			const player1 = this.waitingClients.dequeue(); // First client in the queue is player 1
			const player2 = this.waitingClients.dequeue(); // Second client in the queue is player 2
			const roomId = `${player1.id}_${player2.id}`; // create a Socket.IO websocket room name with both client ids
			const pongBackend = new Pong(); // Start a game for them both
			this.games.set(roomId, pongBackend); // Add to the running games map
			// Add both clients to the same room
			player1.join(roomId);
			player2.join(roomId);
			// Start the game loop; have fun! :)
			this.startGameLoop(player1, player2, roomId);
		}
	}

	startGameLoop(player1: Socket, player2: Socket, roomId: string)
	{
		const pongBackend = this.games.get(roomId);
		let isCleanedUp = false;
		let gameLoop: NodeJS.Timer;
		// Inform each player which paddle is theirs
		player1.emit('player-id', PlayerID.LEFT_PLAYER);
		player2.emit('player-id', PlayerID.RIGHT_PLAYER);
		
		// Set callback to apply Player1 inputs
		player1.on('input', (input: InputState) => {
			pongBackend.applyRemoteP1Input(input);
			console.log("Input");
		});

		// Set callback to apply Player2 inputs
		player2.on('input', (input: InputState) => {
			pongBackend.applyRemoteP2Input(input);
			console.log("Input");
		});

		//Cleanup logic - this should be own function or something
		const cleanUp = () => {
			if (isCleanedUp) return;
			isCleanedUp = true;
			// clean up event listeners and game loop
			player1.removeAllListeners();
			player2.removeAllListeners();
			if (gameLoop)
				clearInterval(gameLoop);
			this.games.delete(roomId);
			console.log("Disconnected, nice and clean-like");
		};

		// Broadcast game state at regular intervals
		gameLoop = setInterval(() => {
			//Set the game state for the next frame
			pongBackend.setGameState();
			//Get the game state
			let gameState = pongBackend.getGameState();
			//Emit game state to all clients in room
			this.server.to(roomId).emit('gameState', gameState);
			//Check if game over
			if (gameState.gameOver)
				cleanUp();
		}, 1000 / 60); // 60 times a second
	}

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
		this.waitingClients.enqueue(client);
		this.matchPlayersAny();
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
