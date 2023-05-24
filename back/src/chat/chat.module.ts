import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelModule } from './chat-channel/chat-channel.module';
import { ChatGateway } from './chat.gateway';
import { UserService } from "../user/user.service";
import { WebSocketService } from '../auth/websocket/websocket.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, UserService, WebSocketService],
  imports: [ChatChannelModule,
  ],
})
export class ChatModule { }
