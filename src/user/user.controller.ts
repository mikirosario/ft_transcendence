import { Controller, Get, UseGuards, Req, Patch, Body, NotFoundException } from "@nestjs/common";
import { JwtGuard } from "../auth/guard";
import { GetJwt } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	constructor(private userService: UserService) { }
	@Get('me')
	async getMe(@GetJwt('sub') userId: number) {
		return this.userService.getMe(userId);
	}

	@Patch('me')
	async editUser(@GetJwt('sub') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}
}
