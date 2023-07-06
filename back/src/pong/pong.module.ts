import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PongGateway } from './pong.gateway';
import { WebSocketService } from '../auth/websocket/websocket.service';
import { PongService } from './pong.service';

@Module({
  controllers: [],
  providers: [UserService, PongGateway, WebSocketService, PongService]
})
export class PongModule { }
