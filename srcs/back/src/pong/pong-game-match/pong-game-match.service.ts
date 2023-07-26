import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PongGameMatchDto } from './dto';


@Injectable()
export class PongGameMatchService {

	constructor(private prisma: PrismaService, private userService: UserService) { }

	async getProfileMatches(userId: number, nick: string) {

		const user = await this.userService.getUserByNick(nick);

		const data = await this.prisma.gameMatch.findMany({
			where: {
			  OR: [
				{ userId1: 2 },
				{ userId2: 2 },
			  ],
			},
		  });



		return {
			user: {
				userId: 1,
				nick: 'karisti-',
				avatarUri: 'basdlsad',
				rank: 1,
				wins: 42,
				losses: 0,
			},
			matches: [
				{
					user1: {
						userId: 1,
						nick: 'karisti-',
						avatarUri: 'basdlsad',
						score: 3,
						isWinner: true,
						rank: 1,
					},
					user2: {
						userId: 2,
						nick: 'gpernas-',
						avatarUri: 'basdlsad',
						score: 1,
						isWinner: false,
						rank: 2
					},
					matchEnded: true
				}
			]
		};
	}

}
