import { Module } from '@nestjs/common';
import { ChatChannelMessageController } from './chat-channel-message.controller';
import { ChatChannelMessageService } from './chat-channel-message.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ChatGateway } from '../chat-socket/chat.gateway';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';
import { WebSocketService } from 'src/auth/websocket/websocket.service';

@Module({
  controllers: [ChatChannelMessageController],
  providers: [ChatChannelMessageService, UserService, ChatChannelService, ChatGateway, WebSocketService],
  imports: [ChatSocketModule]
})
export class ChatChannelMessageModule { }
