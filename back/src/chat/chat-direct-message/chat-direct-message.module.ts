import { Module } from '@nestjs/common';
import { ChatDirectMessageController } from './chat-direct-message.controller';
import { ChatDirectMessageService } from './chat-direct-message.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service'
import { FriendService } from '../../friend/friend.service';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  controllers: [ChatDirectMessageController],
  providers: [ChatDirectMessageService, UserService, ChatBlockedUserService, FriendService,
    WebSocketService ],
  imports: []
})
export class ChatDirectMessageModule { }
