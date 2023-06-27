import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatBlockedDto } from './dto'
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class ChatBlockedUserService {

	constructor(private prisma: PrismaService, private userService: UserService, private friendService: FriendService) { }

	async chatBlockUser(userId: number, dto: ChatBlockedDto) {
		const me = await this.userService.getUserById(userId);
		const otherUser = await this.userService.getUserByNick(dto.nick);

		try {
			const blockedUser = await this.prisma.chatBlockedUser.create({
				data: {
					userId: me.id,
					otherUserId: otherUser.id
				}
			});

			await this.friendService.deleteFriendship(me.id, otherUser.id);
			await this.friendService.deleteFriendship(otherUser.id, me.id);

			return blockedUser;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'You have already blocked this user.');
			}
		}
	}

	async chatUnblockUser(userId: number, dto: ChatBlockedDto) {
		const me = await this.userService.getUserById(userId);
		const otherUser = await this.userService.getUserByNick(dto.nick);

		let blockedUser = await this.prisma.chatBlockedUser.findFirst({
			where: {
				userId: me.id,
				otherUserId: otherUser.id
			}
		});

		if (!blockedUser)
			ThrowHttpException(new NotFoundException, 'User was not blocked.');

		await this.prisma.chatBlockedUser.delete({
			where: {
				id: blockedUser.id
			}
		});

		return blockedUser;
	}

	async isUserBlocked(userId1: number, userId2: number): Promise<boolean> {
		let blockedUser = await this.prisma.chatBlockedUser.findFirst({
			where: {
				userId: userId1,
				otherUserId: userId2
			}
		});

		if (!blockedUser)
			return false;
		return true;
	}

	async getMyBlockedUsersList(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId, },
			include: {
				chatBlockedUser: {
					include: {
						otherUser: true
					},
				} 
			},
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const blockedUsers = user.chatBlockedUser;

		const blockedUsersList: { nick: string, avatarUri: string, }[] = blockedUsers.map((blockedUser) => ({
			nick: blockedUser.otherUser.nick,
			avatarUri: blockedUser.otherUser.avatarUri,
		}));

		return blockedUsersList;
	}
}
