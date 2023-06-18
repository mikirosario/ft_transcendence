import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChatBlockedUserService } from './chat-blocked-user/chat-blocked-user.service';
import { ChatDirectMessageService } from '../chat/chat-direct-message/chat-direct-message.service';
import { ChatChannelService } from '../chat/chat-channel/chat-channel.service';

@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService,
					private chatBlockedUserService: ChatBlockedUserService,
					private chatDirectMessageService: ChatDirectMessageService,
					private chatChannelService: ChatChannelService, ) { }

	async getChats(userId: number) {
		const blockedUsers = await this.chatBlockedUserService.getMyBlockedUsersList(userId);
		const directMessages = await this.chatDirectMessageService.getMyDirectChatsAndMessages(userId);
		const channels = await this.chatChannelService.getMyChannelsAndPublicChannels(userId);

		return {
			channels: channels,
			directs: directMessages,
			blocked_users: blockedUsers
		};
	}
}
