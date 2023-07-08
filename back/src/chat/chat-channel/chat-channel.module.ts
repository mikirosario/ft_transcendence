import { Module } from '@nestjs/common';
import { ChatChannelController } from './chat-channel.controller';
import { ChatChannelService } from './chat-channel.service';
import { UserService } from '../../user/user.service';

@Module({
  controllers: [ChatChannelController],
  providers: [ChatChannelService, UserService],
  imports: []
})
export class ChatChannelModule { }
