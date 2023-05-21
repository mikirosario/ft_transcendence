import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { FriendDto } from "./dto";


@Injectable()
export class FriendService {
	constructor(private prisma: PrismaService) { }

	async addFriend(userId: number, dto: FriendDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const friend = await this.prisma.user.findUnique({
			where: {
				nick: dto.nick
			}
		});

		if (friend === null) {
			ThrowHttpException(new NotFoundException, 'No user with such nick');
		}

		if (user.id == friend.id)
		{
			ThrowHttpException(new BadRequestException, 'You are already your friend! :)');
		}

		try {
			const addedFriend = await this.prisma.friend.create({
				data: {
					userId: userId,
					friend_userId: friend.id
				}
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2025 Record not found
				ThrowHttpException(error, 'Friendship already exists');
			}
		}

		const friends = this.getFriends(userId);
		return friends;
	}

	async getFriends(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId, },
			include: { friendsUser: { include: { friend: true } } },
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const friends = user.friendsUser;

		const friendList: { nick: string; avatarUri: string; isOnline: boolean, isInGame: boolean }[] = friends.map((friend) => ({
			nick: friend.friend.nick,
			avatarUri: friend.friend.avatarUri,
			isOnline: friend.friend.isOnline,
			isInGame: friend.friend.isInGame,
		}));

		return friendList;
	}

	async deleteFriend(userId: number, dto: FriendDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const friend = await this.prisma.user.findUnique({
			where: {
				nick: dto.nick,
			}
		});

		if (friend === null) {
			ThrowHttpException(new NotFoundException, 'Friend not found');
		}

		const friendship = await this.prisma.friend.findFirst({
			where: { userId: user.id, friend_userId: friend.id },
		});
		if (friendship === null) {
			ThrowHttpException(new NotFoundException, 'Friend relationship not found');
		}

		await this.prisma.friend.delete({
			where: {
				id: friendship.id
			}
		});

		const friends = this.getFriends(userId);
		return friends;
	}
}
