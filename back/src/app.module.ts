import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeImageModule } from './utils/serve-image/serve-image.module';
import { OAuthModule } from './oauth/oauth.module';
import { FriendModule } from './friend/friend.module';
import { PongModule } from './pong/pong.module';
import { SecondAuthFactorModule } from './auth/second-auth-factor/second-auth-factor.module'

@Module({
	imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, ServeImageModule,
		FriendModule, PongModule,
		ConfigModule.forRoot({ isGlobal: true }),
		OAuthModule, SecondAuthFactorModule,
	]
})
export class AppModule { }
