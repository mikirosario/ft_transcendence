import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { UserService } from '../user/user.service';
import { WebSocketService } from '../auth/websocket/websocket.service';


@Module({
  controllers: [FriendController],
  providers: [FriendService, UserService, WebSocketService],
  imports: []
})
export class FriendModule { }
