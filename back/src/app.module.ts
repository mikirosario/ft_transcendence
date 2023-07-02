import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServeImageModule } from './utils/serve-image/serve-image.module';
import { OAuthModule } from './oauth/oauth.module';
import { FriendModule } from './friend/friend.module';
import { PongModule } from './pong/pong.module';
import { SecondAuthFactorModule } from './auth/second-auth-factor/second-auth-factor.module'
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [AuthModule, UserModule, PrismaModule, ServeImageModule,
		FriendModule, PongModule, ChatModule,
		ConfigModule.forRoot({ isGlobal: true }),
		OAuthModule, SecondAuthFactorModule,
	]
})
export class AppModule { }
