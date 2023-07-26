import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PongGateway } from './pong.gateway';
import { WebSocketService } from '../auth/websocket/websocket.service';
import { PongService } from './pong.service';
import { PongGameLobbyService } from "./pong-game-lobby/pong-game-lobby.service";
import { PongGameLobbyController } from './pong-game-lobby/pong-game-lobby.controller';
import { PongGameMatchService } from './pong-game-match/pong-game-match.service';
import { PongGameMatchController } from './pong-game-match/pong-game-match.controller';


@Module({
  controllers: [PongGameLobbyController, PongGameMatchController],
  providers: [UserService, PongGateway, WebSocketService, PongService, PongGameLobbyService, PongGameMatchService]
})
export class PongModule { }
