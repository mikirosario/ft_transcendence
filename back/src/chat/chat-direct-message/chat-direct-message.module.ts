import { Module } from '@nestjs/common';
import { ChatDirectMessageController } from './chat-direct-message.controller';
import { ChatDirectMessageService } from './chat-direct-message.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service'
import { FriendService } from 'src/friend/friend.service';

@Module({
  controllers: [ChatDirectMessageController],
  providers: [ChatDirectMessageService, UserService, ChatBlockedUserService, FriendService ]
})
export class ChatDirectMessageModule { }
