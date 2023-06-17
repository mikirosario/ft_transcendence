import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelModule } from './chat-channel/chat-channel.module';
import { ChatChannelUserModule } from './chat-channel-user/chat-channel-user.module';
import { ChatGateway } from './chat.gateway';
import { UserService } from "../user/user.service";
import { WebSocketService } from '../auth/websocket/websocket.service';
import { ChatChannelMessageModule } from '../chat/chat-channel-message/chat-channel-message.module';
import { ChatChannelBannedUserModule } from '../chat/chat-channel-banned-user/chat-channel-banned-user.module';
import { ChatDirectMessageModule } from '../chat/chat-direct-message/chat-direct-message.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, UserService, WebSocketService],
  imports: [ChatChannelModule, ChatChannelUserModule, ChatChannelMessageModule, ChatChannelBannedUserModule, ChatDirectMessageModule],
})
export class ChatModule { }
