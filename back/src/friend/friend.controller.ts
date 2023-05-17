import { Controller, Get, UseGuards, Patch, Body, Delete, Post, UseInterceptors, UploadedFile, Put } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../auth/guard";
import { GetJwt } from "../auth/decorator";
import { FriendService } from "./friend.service";
import { AddFriendDto } from "./dto/friend-add.dto";

@UseGuards(JwtGuard)
@Controller('users')
@ApiBearerAuth()
export class FriendController {
	constructor(private friendService: FriendService) { }
	@Post('friends')
	async addFriend(@GetJwt('sub') userId: number, @Body() dto: AddFriendDto) {
		return this.friendService.addFriend(userId, dto);
	}

}
