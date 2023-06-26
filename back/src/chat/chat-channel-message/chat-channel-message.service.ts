import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatChannelMessageDto } from './dto'

@Injectable()
export class ChatChannelMessageService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatChannelService: ChatChannelService) { }

	async sendChannelMessage(userId: number, dto: ChatChannelMessageDto) {
		const user = await this.userService.getUserById(userId);
		const channel = await this.chatChannelService.getChannel(dto.channel_id);

		await this.chatChannelService.getChannelUser(channel.id, user.id);

		if (await this.chatChannelService.isUserBlocked(channel.id, user.id))
			ThrowHttpException(new UnauthorizedException, 'Not authorized to send message, you are blocked from channel.');

		if (await this.chatChannelService.isUserMuted(channel.id, user.id))
			ThrowHttpException(new UnauthorizedException, 'Not authorized to send message, you are muted on channel.');


		try {
			const newMessage = await this.prisma.chatChannelMessage.create({
				data: {
					channelId: dto.channel_id,
					userId: user.id,
					message: dto.message
				}
			});

			return newMessage;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Error sending message to channel');
			}
		}
	}



	/*
	 * Private methods
	*/

	
}
