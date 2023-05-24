import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeImageModule } from './utils/serve-image/serve-image.module';
import { FriendModule } from './friend/friend.module';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, ServeImageModule,
		FriendModule, PongModule, ChatModule,
		ConfigModule.forRoot({ isGlobal: true }),
	]
})
export class AppModule { }
