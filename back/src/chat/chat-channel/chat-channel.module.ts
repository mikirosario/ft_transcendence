import { Module } from '@nestjs/common';
import { ChatChannelController } from './chat-channel.controller';
import { ChatChannelService } from './chat-channel.service';
import { UserService } from '../../user/user.service';
import { ChatGateway } from '../chat-socket/chat.gateway';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  controllers: [ChatChannelController],
  providers: [ChatChannelService, UserService, ChatGateway, WebSocketService],
  imports: [ChatSocketModule]
})
export class ChatChannelModule { }
