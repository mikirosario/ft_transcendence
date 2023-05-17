import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from '../prisma/prisma.service';
import { ThrowHttpException } from '../utils/error-handler';
import { AddFriendDto, GetFriendDto } from "./dto";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class FriendService {
	constructor(private prisma: PrismaService, private config: ConfigService) { }
	async addFriend(userId: number, dto: AddFriendDto) {
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

		const addedFriend = await this.prisma.friend.create({
			data: {
				userId: userId,
				friend_userId: friend.id
			}
		});

		let resultFriend = new GetFriendDto;
		resultFriend.nick = friend.nick;
		resultFriend.avatarUri = friend.avatarUri;
		resultFriend.status = friend.status;

		return resultFriend;
	}
}
