import { Module } from '@nestjs/common';
import { ChatBlockedUserController } from './chat-blocked-user.controller';
import { ChatBlockedUserService } from './chat-blocked-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { FriendService } from 'src/friend/friend.service';

@Module({
  controllers: [ChatBlockedUserController],
  providers: [ChatBlockedUserService, UserService, ChatChannelService, FriendService ]
})
export class ChatBlockedUserModule { }
