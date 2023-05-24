import { Controller, Get, UseGuards, Body, Delete, Post, Put, Param } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { ChatChannelService } from "./chat-channel.service";
import { ChatChannelDto } from "./dto/chat-channel.dto"



@UseGuards(JwtGuard)
@Controller('chat/channels')
@ApiBearerAuth()
export class ChatChannelController {
	
	constructor(private chatChannelService: ChatChannelService) { }

	@Post()
	@ApiBody({ type: ChatChannelDto })
	async createChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelDto) {
		return this.chatChannelService.createChannel(userId, dto);
	}

	@Put()
	@ApiBody({ type: ChatChannelDto })
	async updateChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelDto) {
		return this.chatChannelService.updateChannel(userId, dto);
	}

	@Delete('/:id')
	async deleteChannel(@GetJwt('sub') userId: number, @Param('id') channelId) {
		return this.chatChannelService.deleteChannel(userId, channelId);
	}
}
