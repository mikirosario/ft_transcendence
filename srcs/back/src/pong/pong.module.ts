import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PongGateway } from './pong.gateway';
import { WebSocketService } from '../auth/websocket/websocket.service';
import { PongService } from './pong.service';
import { PongGameMatchService } from './pong-game-match/pong-game-match.service';
import { PongGameMatchController } from './pong-game-match/pong-game-match.controller';


@Module({
  controllers: [PongGameMatchController],
  providers: [UserService, PongGateway, WebSocketService, PongService, PongGameMatchService]
})
export class PongModule { }
