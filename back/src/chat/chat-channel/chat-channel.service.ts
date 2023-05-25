import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatChannelCreateDto, ChatChannelUpdateDto } from "./dto";
import { UserService } from '../../user/user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2"

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
					ownerUserId: user.id,
					name: dto.name,
					isPrivate: isPrivate,
					hash: hash
				}
			});

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

		if (channel.ownerUserId != user.id)
		{
			ThrowHttpException(new UnauthorizedException, 'You must be admin to change channel details');
		}

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
					ownerUserId: user.id,
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

	async deleteChannel(userId: number, channelId: number) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.getChannel(channelId);

		if (channel.ownerUserId != user.id)
		{
			ThrowHttpException(new UnauthorizedException, 'You must be admin to delete channel');
		}

		await this.prisma.chatChannel.delete({
			where: {
				id: channelId
			}
		});
		
		delete channel.hash;
		return channel;
	}

	/*
	 * Private methods
	*/
	private async getChannel(channelId: number) {
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
}
