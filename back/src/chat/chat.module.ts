import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelModule } from './chat-channel/chat-channel.module';
import { ChatChannelUserModule } from './chat-channel-user/chat-channel-user.module';
import { UserService } from "../user/user.service";
import { WebSocketService } from '../auth/websocket/websocket.service';
import { ChatChannelMessageModule } from '../chat/chat-channel-message/chat-channel-message.module';
import { ChatChannelBannedUserModule } from '../chat/chat-channel-banned-user/chat-channel-banned-user.module';
import { ChatDirectMessageModule } from '../chat/chat-direct-message/chat-direct-message.module';
import { ChatDirectMessageService } from '../chat/chat-direct-message/chat-direct-message.service';
import { ChatBlockedUserModule } from '../chat/chat-blocked-user/chat-blocked-user.module';
import { ChatBlockedUserService } from './chat-blocked-user/chat-blocked-user.service';
import { ChatChannelService } from '../chat/chat-channel/chat-channel.service';
import { FriendService } from '../friend/friend.service';
import { ChatGateway } from './chat-socket/chat.gateway';
import { ChatSocketModule } from './chat-socket/chat-socket.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, UserService, WebSocketService,
              ChatBlockedUserService, ChatDirectMessageService,
              ChatChannelService, FriendService, ChatGateway],
  imports: [ChatChannelModule, ChatChannelUserModule, ChatChannelMessageModule,
            ChatChannelBannedUserModule, ChatDirectMessageModule, ChatBlockedUserModule, ChatSocketModule],
})
export class ChatModule { }
