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

		const user = await this.userService.getUserByNick(nick, {
			id: true,
			nick: true,
			avatarUri: true,
			gamesWon: true,
			gamesLost: true,
			gamesPlayed: true
		});

		const gameMatches = await this.prisma.gameMatch.findMany({
			where: {
				OR: [
						{ userId1: user.id },
						{ userId2: user.id },
				],
			},
			include: {
				user1: {
					select: {
						id: true,
						nick: true,
						avatarUri: true,
					}
				},
				user2: {
					select: {
						id: true,
						nick: true,
						avatarUri: true,
					}
				},
				winnerUser: {
					select: {
						id: true,
					}
				},
			},
		});

		const rank = await this.getUserRank(user.nick);

		let result = {
			user: {
				userId: user.id,
				nick: user.nick,
				avatarUri: user.avatarUri,
				rank: rank,
				wins: user.gamesWon,
				losses: user.gamesLost,
			},
			matches: this.formatGameMatches(gameMatches)
		};

		return result;
	}

	private formatGameMatches(gameMatchesList: any) {
		const gameMatchesListFormatted: any[] = gameMatchesList.map((match) => ({
			user1: {
				userId: match.user1.id,
				nick: match.user1.nick,
				avatarUri: match.user1.avatarUri,
				score: match.score1,
				isWinner: match.user1.id == match.winnerUser.id,
			},
			user2: {
				userId: match.user2.id,
				nick: match.user2.nick,
				avatarUri: match.user2.avatarUri,
				score: match.score2,
				isWinner: match.user2.id == match.winnerUser.id,
			},
			matchEnded: match.hasEnded
		}));

		return gameMatchesListFormatted;
	}

	private async getUserRank(nick: string) {
		const users = await this.prisma.user.findMany();
		
		// Calcular el ratio para cada usuario
		const usersWithRatio = users.map(user => ({
			...user,
			ratio: user.gamesWon / user.gamesLost,
		}));
	
		const sortedUsers = usersWithRatio.sort((a, b) => b.ratio - a.ratio);

		const rank = sortedUsers.findIndex(user => user.nick === nick) + 1;
	
		return rank;
	  }

}
