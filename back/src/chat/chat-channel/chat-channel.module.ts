import { Module } from '@nestjs/common';
import { ChatChannelController } from './chat-channel.controller';
import { ChatChannelService } from './chat-channel.service';

@Module({
  controllers: [ChatChannelController],
  providers: [ChatChannelService]
})
export class ChatChannelModule { }
