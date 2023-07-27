import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PongGameLobbyDto } from './dto';


@Injectable()
export class PongGameLobbyService {

	constructor(private prisma: PrismaService, private userService: UserService) { }

	async addUserToLobby(userId: number) {
		const user = await this.userService.getUserById(userId);

		try {
			await this.prisma.gameLobby.create({
				data: {
					userId: user.id
				}
			});
			
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Error al entrar a la lobby');
			}
		}
	}
}
