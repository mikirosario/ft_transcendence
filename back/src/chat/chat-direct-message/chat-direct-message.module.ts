import { Module } from '@nestjs/common';
import { ChatDirectMessageController } from './chat-direct-message.controller';
import { ChatDirectMessageService } from './chat-direct-message.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';

@Module({
  controllers: [ChatDirectMessageController],
  providers: [ChatDirectMessageService, UserService, ChatChannelService ]
})
export class ChatDirectMessageModule { }
