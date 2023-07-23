import { Injectable, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { JwtService } from "@nestjs/jwt";
import { OAuthDto } from "./dto/oauth.dto";
import { UserOAuthDto } from "../user/dto/user-oauth.dto";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ThrowHttpException } from "../utils/error-handler";
import { UserService } from "../user/user.service";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";

@Injectable()
export class OAuthService {
	constructor(
		private config: ConfigService,
		private jwt: JwtService,
		private prisma: PrismaService,
		private userService: UserService,
	) { }

	private readonly clientId: string = this.config.get('CLIENT_ID');
	private readonly clientSecret: string = this.config.get('CLIENT_SECRET');
	private readonly redirectUri: string = this.config.get('REDIRECT_URI');
	private readonly tokenEndpoint: string = 'https://api.intra.42.fr/oauth/token';
	private readonly authorizationEndpoint: string = 'https://api.intra.42.fr/oauth/authorize';
	private readonly userInfoEndPoint: string = 'https://api.intra.42.fr/v2/me';

	async exchangeAuthorizationCode(code: string): Promise<string> {
		try {
			const response: AxiosResponse = await axios.post(this.tokenEndpoint, {
				grant_type: 'authorization_code',
				client_id: this.clientId,
				client_secret: this.clientSecret,
				code,
				redirect_uri: this.redirectUri,
			});

			return response.data.access_token;
		} catch (error) {
			ThrowHttpException(new BadRequestException, 'Failed to exchange authorization code for access token.');
			//throw new Error('Failed to exchange authorization code for access token.');
		}
	}

	async fetchUserInfo(accessToken: string): Promise<any> {
		try {
			const response: AxiosResponse = await axios.get(this.userInfoEndPoint, {
				headers: {
					Authorization: 'Bearer ' + accessToken,
				}
			});
			return response.data;
		} catch (error) {
			console.log(error);
			ThrowHttpException(new BadRequestException, 'Failed to fetch user information.');
			//throw new Error('Failed to fetch user information. ');
		}
	}

	generateAuthorizationUrl(): string {
		const authorizationUrl = `${this.authorizationEndpoint}?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code`;
		return authorizationUrl;
	}

	async signToken(userId: number, email: string): Promise<OAuthDto> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: secret
		});

		return {
			access_token: token,
		};
	}

	async signup(dto: UserOAuthDto) {
		//save new user in db
		try {
			let user = await this.userService.getUserByLogin(dto.login)
			if (user == null) {

				let isSiteOwner = false;
				let isSiteAdmin = false;

				if (dto.login == this.config.get('SITE_OWNER_LOGIN')){
					isSiteOwner = true;
					isSiteAdmin = true;
				}
				
				if (this.config.get('SITE_ADMIN_LOGINS').includes(dto.login))
					isSiteAdmin = true;

				user = await this.prisma.user.create({
					data: {
						email: dto.email,
						nick: dto.login,
						login: dto.login,
						avatarUri: dto.avatar,
						isSiteOwner: isSiteOwner,
						isSiteAdmin: isSiteAdmin
					},
				})
			}

			if (user.isBanned)
				ThrowHttpException(new UnauthorizedException, 'Estás baneado de la página');

			let jwtToken = await this.signToken(user.id, user.email);
			console.log(jwtToken)
			return jwtToken;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2002 "Unique constraint failed on the {constraint}"
				ThrowHttpException(error, 'Credentials taken');
			}
			throw error;
		}
	}
}
