import { Controller, Get, UseGuards, Req, Patch, Body, NotFoundException, Delete } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../auth/guard";
import { GetJwt } from "../auth/decorator";
import { EditUserDto } from "./dto";
import { UserService } from "./user.service";

@UseGuards(JwtGuard)
@Controller('users')
@ApiBearerAuth()
export class UserController {
	constructor(private userService: UserService) { }
	@Get('me')
	async getMe(@GetJwt('sub') userId: number) {
		return this.userService.getMe(userId);
	}

	@Patch('me')
	@ApiBody({ type: EditUserDto })
	async editUser(@GetJwt('sub') userId: number, @Body() dto: EditUserDto) {
		return this.userService.editUser(userId, dto);
	}

	@Delete('me')
	async deleteUser(@GetJwt('sub') userId: number) {
		return this.userService.deleteUser(userId);
	}
}
