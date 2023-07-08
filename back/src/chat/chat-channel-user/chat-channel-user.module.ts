import { Module } from '@nestjs/common';
import { ChatChannelUserController } from './chat-channel-user.controller';
import { ChatChannelUserService } from './chat-channel-user.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';

@Module({
  controllers: [ChatChannelUserController],
  providers: [ChatChannelUserService, UserService, ChatChannelService],
  imports: []
})
export class ChatChannelUserModule { }
