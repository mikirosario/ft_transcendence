import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { FriendDto } from "./dto";
import { UserService } from '../user/user.service';


@Injectable()
export class FriendService {
	constructor(private prisma: PrismaService, private userService: UserService) { }

	async addFriend(userId: number, dto: FriendDto) {
		const user = await this.userService.getUserById(userId);
		const friend = await this.userService.getUserByNick(dto.nick);

		if (user.id == friend.id)
			ThrowHttpException(new BadRequestException, 'You are already your friend! :)');
		
		await this.createFriendship(user.id, friend.id, false);

		const friends = this.getFriendsFiltered(userId, true);
		return friends;
	}

	async acceptFriend(userId: number, dto: FriendDto) {
		const user = await this.userService.getUserById(userId);
		const friend = await this.userService.getUserByNick(dto.nick);

		const friendship = await this.getFriendship(friend.id, user.id);
		await this.updateFriendship(friendship.id, {accepted: true});

		await this.createFriendship(user.id, friend.id, true);

		const friends = this.getFriendsFiltered(userId, true);
		return friends;
	}

	async getFriends(userId: number) {
		const friendList = await this.getFriendsFiltered(userId, true);

		return friendList;
	}
	
	async getFriendRequests(userId: number) {
		const friendList = await this.getFriendsFiltered(userId, false);
		
		return friendList;
	}

	async deleteFriend(userId: number, dto: FriendDto) {
		const user = await this.userService.getUserById(userId);
		const friend = await this.userService.getUserByNick(dto.nick);

		await this.deleteFriendship(user.id, friend.id);
		await this.deleteFriendship(friend.id, user.id);

		const friends = this.getFriendsFiltered(userId, true);
		return friends;
	}

	/*
	Private methods
	*/
	private async createFriendship(userId1: number, userId2: number, accepted: boolean) {
		try {
			const addedFriend = await this.prisma.friend.create({
				data: {
					userId: userId1,
					friend_userId: userId2,
					accepted: accepted
				}
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				// https://www.prisma.io/docs/reference/api-reference/error-reference
				// P2025 Record not found
				ThrowHttpException(error, 'Friendship already exists');
			}
		}
	}

	private async updateFriendship(friendshipId: number, data: any) {
		try {
			await this.prisma.friend.update({
				where: {
					id: friendshipId
				},
				data: data
			});
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Prisma error');
			}
		}
	}

	private async getFriendship(userId1, userId2) {
		const friendship = await this.prisma.friend.findFirst({
			where: { userId: userId1, friend_userId: userId2 },
		});

		if (friendship === null) {
			ThrowHttpException(new NotFoundException, 'Friend relationship not found');
		}

		return friendship;
	}

	private async getFriendsFiltered(userId: number, accepted: boolean) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId, },
			include: {
				friendsUser: {
					include: {
						friend: true
					},
					where: {
						accepted: accepted
					}
				} 
			},
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

	private async deleteFriendship(userId1: number, userId2: number) {
		const friendship = await this.prisma.friend.findFirst({
			where: { userId: userId1, friend_userId: userId2 },
		});

		if (friendship === null) {
			ThrowHttpException(new NotFoundException, 'Friend relationship not found');
		}

		await this.prisma.friend.delete({
			where: {
				id: friendship.id
			}
		});
	}
}
