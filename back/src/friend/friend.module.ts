import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { ChatSocketModule } from '../chat/chat-socket/chat-socket.module';
import { ChatGateway } from '../chat/chat-socket/chat.gateway';
import { WebSocketService } from '../auth/websocket/websocket.service'

@Module({
  controllers: [FriendController],
  providers: [FriendService, UserService, WebSocketService,ChatGateway],
  imports: [ChatSocketModule]
})
export class FriendModule { }
