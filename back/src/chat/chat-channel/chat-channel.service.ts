import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatChannelDto } from "./dto/chat-channel.dto"


@Injectable()
export class ChatChannelService {
	constructor(private prisma: PrismaService) { }

	async createChannel(userId: number, dto: ChatChannelDto) {
		return {};
	}

	async updateChannel(userId: number, dto: ChatChannelDto) {
		return {};
	}

	async deleteChannel(userId: number, channelId: number) {
		return {};
	}
}
