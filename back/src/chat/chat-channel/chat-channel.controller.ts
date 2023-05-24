import { Controller, Get, UseGuards, Body, Delete, Post, Put, Param } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { ChatChannelService } from "./chat-channel.service";
import { ChatChannelCreateDto, ChatChannelUpdateDto } from "./dto";



@UseGuards(JwtGuard)
@Controller('chat/channels')
@ApiBearerAuth()
export class ChatChannelController {
	
	constructor(private chatChannelService: ChatChannelService) { }

	@Post()
	@ApiBody({ type: ChatChannelCreateDto })
	async createChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelCreateDto) {
		return this.chatChannelService.createChannel(userId, dto);
	}

	@Put()
	@ApiBody({ type: ChatChannelUpdateDto })
	async updateChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelUpdateDto) {
		return this.chatChannelService.updateChannel(userId, dto);
	}

	@Delete('/:id')
	async deleteChannel(@GetJwt('sub') userId: number, @Param('id') channelId: number) {
		return this.chatChannelService.deleteChannel(userId, channelId);
	}
}
