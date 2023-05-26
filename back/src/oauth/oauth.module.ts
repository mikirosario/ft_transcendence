import { Module } from '@nestjs/common';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { JwtService } from '@nestjs/jwt';


@Module({
    controllers: [OAuthController],
    providers: [OAuthService, JwtService]
})
export class OAuthModule{}
