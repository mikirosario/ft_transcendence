import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatBlockedUserService } from './chat-blocked-user/chat-blocked-user.service';


@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService, private chatBlockedUserService: ChatBlockedUserService) { }

	async getChats(userId: number) {
		const blockedUsers = await this.chatBlockedUserService.getBlockedUsersList(userId);

		return {
			channels: [],
			directs: [],
			blocked_users: blockedUsers
		};
	}
}
