import { Module } from '@nestjs/common';
import { ChatDirectMessageController } from './chat-direct-message.controller';
import { ChatDirectMessageService } from './chat-direct-message.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service'
import { FriendService } from '../../friend/friend.service';
import { ChatGateway } from '../chat-socket/chat.gateway';
import { ChatService } from '../chat.service';
import { ChatSocketModule } from '../chat-socket/chat-socket.module';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  controllers: [ChatDirectMessageController],
  providers: [ChatDirectMessageService, UserService, ChatBlockedUserService, FriendService, WebSocketService, ChatGateway],
  imports: [ChatSocketModule]
})
export class ChatDirectMessageModule { }
