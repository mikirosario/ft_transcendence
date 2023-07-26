import { Controller, UseGuards, Get, Query } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { PongGameMatchService } from "./pong-game-match.service";
import { PongGameMatchDto } from './dto'


@UseGuards(JwtGuard)
@Controller('profile/matches')
@ApiBearerAuth()
export class PongGameMatchController {
	
	constructor(private pongGameMatchService: PongGameMatchService) { }

	@Get()
	async getProfileMatches(@GetJwt('sub') userId: number, @Query('nick') nick: string) {
		return this.pongGameMatchService.getProfileMatches(userId, String(nick));
	}
}
