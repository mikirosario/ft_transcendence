import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatChannelBannedUserDto } from './dto'

@Injectable()
export class ChatChannelBannedUserService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatChannelService: ChatChannelService) { }

	async blockUserInChannel(userId: number, dto: ChatChannelBannedUserDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.chatChannelService.getChannel(dto.channel_id);

		await this.chatChannelService.checkUserIsAuthorizedInChannnel(user.id, channel.id);

		let bannedUser = await this.chatChannelService.getBannedUser(channel.id, dto.user_id);

		try {
			bannedUser = await this.prisma.chatChannelBannedUser.update({
				where: {
					id: bannedUser.id
				},
				data: {
					isBanned: dto.isBanned
				}
			});

			return bannedUser;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Unknown error updating banned user');
			}
		}

	}

	async muteUserInChannel(userId: number, dto: ChatChannelBannedUserDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.chatChannelService.getChannel(dto.channel_id);

		await this.chatChannelService.checkUserIsAuthorizedInChannnel(user.id, channel.id);

		let bannedUser = await this.chatChannelService.getBannedUser(channel.id, dto.user_id);

		let currentTime = new Date().getTime();
		let mutedUntil = new Date(currentTime + (dto.isMutedSecs * 1000));

		try {
			bannedUser = await this.prisma.chatChannelBannedUser.update({
				where: {
					id: bannedUser.id
				},
				data: {
					isMutedUntil: mutedUntil
				}
			});

			return bannedUser;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Unknown error updating muted user');
			}
		}
	}

}
