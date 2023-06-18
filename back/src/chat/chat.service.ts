import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatBlockedUserService } from './chat-blocked-user/chat-blocked-user.service';
import { ChatDirectMessageService } from '../chat/chat-direct-message/chat-direct-message.service';


@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService,
					private chatBlockedUserService: ChatBlockedUserService,
					private chatDirectMessageService: ChatDirectMessageService, ) { }

	async getChats(userId: number) {
		const blockedUsers = await this.chatBlockedUserService.getMyBlockedUsersList(userId);
		const directMessages = await this.chatDirectMessageService.getMyDirectChatsAndMessages(userId);

		return {
			channels: [],
			directs: directMessages,
			blocked_users: blockedUsers
		};
	}
}
