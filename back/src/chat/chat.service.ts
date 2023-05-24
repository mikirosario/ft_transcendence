import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class ChatService {
	constructor(private prisma: PrismaService) { }

	async getChats(userId: number) {
		return {
			channels: [],
			directs: [],
			blocked_users: []
		};
	}
}
