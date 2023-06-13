import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../user/user.service';
import { ChatChannelService } from '../chat-channel/chat-channel.service';
import { ThrowHttpException } from '../../utils/error-handler';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from "argon2";
import { ChatChannelMessageDto } from './dto'

@Injectable()
export class ChatChannelMessageService {

	constructor(private prisma: PrismaService, private userService: UserService,
				private chatChannelService: ChatChannelService) { }

	async sendChannelMessage(userId: number, dto: ChatChannelMessageDto) {
	}



	/*
	 * Private methods
	*/

	
}
