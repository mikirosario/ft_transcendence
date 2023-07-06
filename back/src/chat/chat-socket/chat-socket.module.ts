import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from '../../user/user.service';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  providers: [ChatGateway, UserService, WebSocketService],
})
export class ChatSocketModule { }
