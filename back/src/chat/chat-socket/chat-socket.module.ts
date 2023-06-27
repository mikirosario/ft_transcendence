import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { UserService } from 'src/user/user.service';
import { WebSocketService } from 'src/auth/websocket/websocket.service';

@Module({
  providers: [ChatGateway, UserService, WebSocketService],
})
export class ChatSocketModule { }
