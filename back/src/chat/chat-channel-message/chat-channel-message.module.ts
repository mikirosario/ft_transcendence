import { Module } from '@nestjs/common';
import { ChatChannelMessageController } from './chat-channel-message.controller';
import { ChatChannelMessageService } from './chat-channel-message.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';

@Module({
  controllers: [ChatChannelMessageController],
  providers: [ChatChannelMessageService, UserService, ChatChannelService],
  imports: []
})
export class ChatChannelMessageModule { }
