import { Module } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { PongGateway } from './pong.gateway';
import { WebSocketService } from '../auth/websocket/websocket.service';

@Module({
  controllers: [],
  providers: [UserService, PongGateway, WebSocketService]
})
export class PongModule { }
