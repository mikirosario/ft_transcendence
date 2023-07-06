import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatBlockedUserService } from '../chat-blocked-user/chat-blocked-user.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ChatDirectMessageDto } from './dto'

@Injectable()
export class ChatDirectMessageService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatBlockedUserService: ChatBlockedUserService) { }

	async sendDirectMessage(userId: number, dto: ChatDirectMessageDto) {
		const user1 = await this.userService.getUserById(userId);
		const user2 = await this.userService.getUserById(dto.user_id);

		const directChat = await this.getDirectChatByUserIds(user1.id, user2.id);
		if (!directChat)
			ThrowHttpException(new BadRequestException, 'Some error occurred creating direct chat.');

		if (await this.chatBlockedUserService.isUserBlocked(user1.id, user2.id))
			ThrowHttpException(new BadRequestException, 'You cant send a message to blocked users.');

		if (await this.chatBlockedUserService.isUserBlocked(user2.id, user1.id))
			ThrowHttpException(new BadRequestException, 'You cant send a message, you are blocked by the other user.');
		
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

	async getDirectChat(userId: number, otherUserId: number) {
		const directChat = await this.getDirectChatByUserIds(userId, otherUserId);

		return await this.getDirectChatAndMessages(userId, directChat.id);
	}




	/*
	 * Private methods
	*/
	private async getDirectChatByUserIds(userId1: number, userId2: number) {
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
			ThrowHttpException(new NotFoundException, 'Error creating direct chat.');
		}
	}

	private async getDirectChatAndMessages(userId: number, chatId: number) {
		let directChat = await this.prisma.chatDirect.findUnique({
			where: { id: chatId },
			include: {
			  chatDirectMessageDirect: {
				include: {
				  user: {
					select: {
					  nick: true
					}
				  },
				}
			  },
			  user1: {
				select: {
					id: true,
					nick: true,
					avatarUri: true,
				}
			  },
			  user2: {
				select: {
					id: true,
					nick: true,
					avatarUri: true,
				}
			  }
			}
		  });


		// Reestructuración de los datos para coincidir con el formato de JSON deseado
		let messages = directChat.chatDirectMessageDirect.map(message => {
			return {
				sender: message.user.nick,
				sentAt: message.sentAt,
				message: message.message,
			}
		});
		

		let me = directChat.user1;
		let other = directChat.user2;

		if (directChat.user2.id == userId) {
			me = directChat.user2;
			other = directChat.user1;
		}

		let chatDirectInfo = {
			chatId: directChat.id,
			me: me,
			other: other,
			messages: messages
		}

		return chatDirectInfo;
	}
	
}
