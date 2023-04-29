import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";
import { Request } from "express";
import { GetUser } from "src/auth/decorator";

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
	@Get('me')
	getMe(@GetUser() user: User) {
		return user;
	}
}
