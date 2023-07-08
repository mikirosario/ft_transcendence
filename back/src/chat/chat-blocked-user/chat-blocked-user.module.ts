import { Module } from '@nestjs/common';
import { ChatBlockedUserController } from './chat-blocked-user.controller';
import { ChatBlockedUserService } from './chat-blocked-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { FriendService } from '../../friend/friend.service';
import { WebSocketService } from '../../auth/websocket/websocket.service';

@Module({
  controllers: [ChatBlockedUserController],
  providers: [ChatBlockedUserService, UserService, ChatChannelService, FriendService,
    WebSocketService],
  imports: []
})
export class ChatBlockedUserModule { }
