import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatDirectMessageDto } from './dto'

@Injectable()
export class ChatDirectMessageService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatChannelService: ChatChannelService) { }

	async sendDirectMessage(userId: number, dto: ChatDirectMessageDto) {
		const user1 = await this.userService.getUserById(userId);
		const user2 = await this.userService.getUserById(dto.user_id);

		const directChat = await this.getDirectChat(user1.id, user2.id);
		if (!directChat)
			ThrowHttpException(new BadRequestException, 'Some error occurred creating direct chat.');

		// TODO: Dont send if user2 has user 1 blocked or user1 has user2 blocked
		
		try {
			const newMessage = await this.prisma.chatDirectMessage.create({
				data: {
					directId: directChat.id,
					userId: user1.id,
					message: dto.message
				}
			});

			return newMessage;

		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				ThrowHttpException(error, 'Error sending direct message');
			}
		}
	}



	/*
	 * Private methods
	*/
	private async getDirectChat(userId1: number, userId2: number) {
		let directChat = await this.prisma.chatDirect.findFirst({
			where: {
				userId1: userId1,
				userId2: userId2,
			}
		});

		if (directChat)
			return directChat;

		directChat = await this.prisma.chatDirect.findFirst({
				where: {
					userId1: userId2,
					userId2: userId1,
				}
			});
	
			if (directChat)
				return directChat;
			
		try {
			directChat = await this.prisma.chatDirect.create({
				data: {
					userId1: userId1,
					userId2: userId2,
				}
			});
			return directChat;

		} catch (error) {
			return null;
		}
	}

	
}
