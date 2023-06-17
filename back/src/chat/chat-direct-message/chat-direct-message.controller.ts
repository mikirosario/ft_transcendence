import { Controller, UseGuards, Body, Post } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { ChatDirectMessageService } from "./chat-direct-message.service";
import { ChatDirectMessageDto } from './dto'


@UseGuards(JwtGuard)
@Controller('chat/direct')
@ApiBearerAuth()
export class ChatDirectMessageController {
	
	constructor(private chatDirectMessageService: ChatDirectMessageService) { }

	@Post('message')
	@ApiBody({ type: ChatDirectMessageDto })
	async sendDirectMessage(@GetJwt('sub') userId: number, @Body() dto: ChatDirectMessageDto) {
		return this.chatDirectMessageService.sendDirectMessage(userId, dto);
	}
}
