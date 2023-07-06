import { Module } from '@nestjs/common';
import { ChatChannelUserController } from './chat-channel-user.controller';
import { ChatChannelUserService } from './chat-channel-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ChatGateway } from '../chat-socket/chat.gateway';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  controllers: [ChatChannelUserController],
  providers: [ChatChannelUserService, UserService, ChatChannelService, ChatGateway, WebSocketService],
  imports: [ChatSocketModule]
})
export class ChatChannelUserModule { }
