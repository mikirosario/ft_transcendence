import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatChannelModule } from './chat-channel/chat-channel.module';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [ChatChannelModule,
  ],
})
export class ChatModule { }
