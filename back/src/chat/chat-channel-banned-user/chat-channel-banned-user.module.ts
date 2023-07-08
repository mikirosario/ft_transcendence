import { Module } from '@nestjs/common';
import { ChatChannelBannedUserController } from './chat-channel-banned-user.controller';
import { ChatChannelBannedUserService } from './chat-channel-banned-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';

@Module({
  controllers: [ChatChannelBannedUserController],
  providers: [ChatChannelBannedUserService, UserService, ChatChannelService],
  imports: []
})
export class ChatChannelBannedUserModule { }
