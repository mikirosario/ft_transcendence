import { Controller, Get, UseGuards, Body, Delete, Post, Put, Param } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { ChatChannelUserService } from "./chat-channel-user.service";
import { ChatChannelUserDto } from './dto'


@UseGuards(JwtGuard)
@Controller('chat/channels')
@ApiBearerAuth()
export class ChatChannelUserController {
	
	constructor(private chatChannelUserService: ChatChannelUserService) { }

	@Post('join')
	@ApiBody({ type: ChatChannelUserDto })
	async joinChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelUserDto) {
		return this.chatChannelUserService.joinChannel(userId, dto);
	}

	@Delete('leave')
	@ApiBody({ type: ChatChannelUserDto })
	async leaveChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelUserDto) {
		return this.chatChannelUserService.leaveChannel(userId, dto);
	}
}
