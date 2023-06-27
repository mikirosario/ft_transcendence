import { Module } from '@nestjs/common';
import { ChatChannelBannedUserController } from './chat-channel-banned-user.controller';
import { ChatChannelBannedUserService } from './chat-channel-banned-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';
import { ChatGateway } from '../chat-socket/chat.gateway';
import { WebSocketService } from 'src/auth/websocket/websocket.service';

@Module({
  controllers: [ChatChannelBannedUserController],
  providers: [ChatChannelBannedUserService, UserService, ChatChannelService, ChatGateway, WebSocketService],
  imports: [ChatSocketModule]
})
export class ChatChannelBannedUserModule { }
