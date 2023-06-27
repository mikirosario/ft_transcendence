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

		const directChat = await this.getDirectChat(user1.id, user2.id);
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

	async getMyDirectChatsAndMessages(userId: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId, },
			include: {
				chatDirectUser1: {
					include: {
						user1: true,
						user2: true,
						chatDirectMessageDirect: {
							include: {
								user: true,
							}
						},
					},
				}
			},
		});

		if (user === null) {
			ThrowHttpException(new NotFoundException, 'User not found');
		}

		const directChats = user.chatDirectUser1;


		// iterate through all direct chats
		const directChatsList: { user1: string, user2: string, messages: { sentAt: string, user: string, message: string }[] }[] = directChats.map((directChat) => ({
			user1: directChat.user1.nick,
			user2: directChat.user2.nick,
			createdAt: directChat.createdAt,
			messages: this.formatDirectMessages(directChat.chatDirectMessageDirect)
		}));
		

		return directChatsList;
	}

	private formatDirectMessages(messages: any) {
		const directMessages: { sentAt: string, user: string, message: string }[] = messages.map((msg) => ({
			sentAt: msg.sentAt,
			user: msg.user.nick,
			message: msg.message
		}));

		return directMessages;
	}

	
}
