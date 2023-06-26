import { Controller, UseGuards, Body, Put } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { ChatChannelBannedUserService } from "./chat-channel-banned-user.service";
import { ChatChannelBannedUserDto } from './dto'


@UseGuards(JwtGuard)
@Controller('chat/channels')
@ApiBearerAuth()
export class ChatChannelBannedUserController {
	
	constructor(private chatChannelBannedUserService: ChatChannelBannedUserService) { }

	@Put('block')
	@ApiBody({ type: ChatChannelBannedUserDto })
	async blockUserInChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelBannedUserDto) {
		return this.chatChannelBannedUserService.blockUserInChannel(userId, dto);
	}

	@Put('mute')
	@ApiBody({ type: ChatChannelBannedUserDto })
	async muteUserInChannel(@GetJwt('sub') userId: number, @Body() dto: ChatChannelBannedUserDto) {
		return this.chatChannelBannedUserService.muteUserInChannel(userId, dto);
	}
}
