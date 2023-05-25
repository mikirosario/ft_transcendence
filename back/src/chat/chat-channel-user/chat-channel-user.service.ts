import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2"
import { ChatChannelUserDto } from './dto'

@Injectable()
export class ChatChannelUserService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatChannelService: ChatChannelService) { }

	async joinChannel(userId: number, dto: ChatChannelUserDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.chatChannelService.getChannel(dto.id);

		if (channel.isPrivate == true)
			this.checkChannelPassword(channel.hash, dto.password);

		try {
			const newChannelUser = await this.prisma.chatChannelUser.create({
				data: {
					channelId: channel.id,
					userId: user.id
				}
			});

			return newChannelUser;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'You are already on this channel');
			}
		}
	}

	async leaveChannel(userId: number, dto: ChatChannelUserDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.chatChannelService.getChannel(dto.id);

		const channelUser = await this.prisma.chatChannelUser.findFirst({
			where: {
				channelId: channel.id,
				userId: user.id,
			}
		});

		if (channelUser == null)
			ThrowHttpException(new NotFoundException, 'You are not on this channel');

		await this.prisma.chatChannelUser.delete({
			where: {
				id: channelUser.id
			}
		});
		
		return channelUser;
	}

	/*
	 * Private methods
	*/
	private async checkChannelPassword(channelHash: string, dtoPassword: string) {
		if (dtoPassword == null)
			ThrowHttpException(new BadRequestException, 'You must provide a correct password');

		const passwordMatches = await argon.verify(channelHash, dtoPassword);
		if (!passwordMatches)
			ThrowHttpException(new BadRequestException, 'You must provide a correct password');
	}
}
