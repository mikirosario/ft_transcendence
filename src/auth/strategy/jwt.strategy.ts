import { ExtractJwt, Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport";
import { NotFoundException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config"
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(config: ConfigService, private prisma: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey: config.get('JWT_SECRET'),
		});
	}

	async validate(payload: any) {
		return payload;
	}
}