import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatChannelCreateDto, ChatChannelUpdateDto } from "./dto";
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";

@Injectable()
export class ChatChannelService {
	constructor(private prisma: PrismaService, private userService: UserService) { }

	async createChannel(userId: number, dto: ChatChannelCreateDto) {
		let hash: string = null;
		let isPrivate: boolean = false;

		const user = await this.userService.getUserById(userId);

		if (dto.password != null && dto.password.length > 0)
		{
			hash = await argon.hash(dto.password);
			isPrivate = true;
		}
		
		try {
			const newChannel = await this.prisma.chatChannel.create({
				data: {
					name: dto.name,
					isPrivate: isPrivate,
					hash: hash
				}
			});
			
			await this.joinChannelOwner(newChannel.id, user.id);

			delete newChannel.hash;
			return newChannel;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Already exists a channel with that name');
			}
		}
	}

	async updateChannel(userId: number, dto: ChatChannelUpdateDto) {
		let hash: string = null;
		let isPrivate: boolean = false;

		const user = await this.userService.getUserById(userId);
		const channel = await this.getChannel(dto.id);

		await this.checkUserIsAuthorizedInChannnel(user.id, channel.id);


		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		/*
		TODO: Comprobar si el usuario que lo intenta es administrador en el canal (ChannelUsers)
		*/

		if (dto.password != null && dto.password.length > 0)
		{
			hash = await argon.hash(dto.password);
			isPrivate = true;
		}

		try {
			const channel = await this.prisma.chatChannel.update({
				where: {
					id: dto.id
				},
				data: {
					name: dto.name,
					isPrivate: isPrivate,
					hash: hash
				}
			});

			delete channel.hash;
			return channel;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Already exists a channel with that name');
			}
		}
	}

	async deleteChannel(userId: number, dto: ChatChannelUpdateDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.getChannel(dto.id);

		await this.checkUserIsAuthorizedInChannnel(user.id, channel.id);

		await this.prisma.chatChannel.delete({
			where: {
				id: channel.id
			}
		});
		
		delete channel.hash;
		return channel;
	}

	/*
	 * Private methods
	*/
	async getChannel(channelId: number) {
		if (channelId == null)
			ThrowHttpException(new BadRequestException, 'You must provide channel id');

		const channel = await this.prisma.chatChannel.findUnique({
			where: {
				id: channelId,
			}
		});

		if (channel === null) {
			ThrowHttpException(new NotFoundException, 'Channel not found');
		}

		return channel;
	}

	async checkUserIsAuthorizedInChannnel(userId: number, channelId: number) {

		try {
			const channelUser = await this.getChannelUser(channelId, userId);

			if (channelUser.isOwner || channelUser.isAdmin)
				return true;
		} catch (error) {
			ThrowHttpException(new UnauthorizedException, 'You must be channel owner or admin to do this action');
		}
		
		ThrowHttpException(new UnauthorizedException, 'You must be channel owner or admin to do this action');
	}

	async getChannelUser(channel_id: number, user_id: number) {
		const channelUser = await this.prisma.chatChannelUser.findFirst({
			where: {
				channelId: channel_id,
				userId: user_id,
			}
		});

		if (channelUser == null)
			ThrowHttpException(new NotFoundException, 'User not in channel');

		return channelUser;
	}

	private async joinChannelOwner(channelId: number, userId: number) {
		try {
			await this.prisma.chatChannelUser.create({
				data: {
					channelId: channelId,
					userId: userId,
					isOwner: true
				}
			});
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'You are already on this channel');
			}
		}
	}

	async getBannedUser(channelId: number, userId: number)
	{
		let channelBannedUser = await this.prisma.chatChannelBannedUser.findFirst({
			where: {
				channelId: channelId,
				userId: userId,
			}
		});

		if (channelBannedUser)
			return channelBannedUser;
			
		try {
			channelBannedUser = await this.prisma.chatChannelBannedUser.create({
				data: {
					channelId: channelId,
					userId: userId
				}
			});
			return channelBannedUser;

		} catch (error) {
			return null;
		}
	}

	async isUserBlocked(channelId: number, userId: number) {
		const channelBannedUser = await this.getBannedUser(channelId, userId);

		return channelBannedUser.isBanned;
	}

	async isUserMuted(channelId: number, userId: number) {
		const channelBannedUser = await this.getBannedUser(channelId, userId);

		let currentTime = new Date().getTime();
		let mutedUntil = new Date(channelBannedUser.isMutedUntil).getTime();

		if (mutedUntil > currentTime)
			return true;
		return false;
	}

}
