import { Controller, UseGuards, Get, Query } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { PongGameMatchService } from "./pong-game-match.service";


@UseGuards(JwtGuard)
@Controller('')
@ApiBearerAuth()
export class PongGameMatchController {
	
	constructor(private pongGameMatchService: PongGameMatchService) { }

	@Get('profile/matches')
	async getProfileMatches(@GetJwt('sub') userId: number, @Query('nick') nick: string) {
		return this.pongGameMatchService.getProfileMatches(userId, String(nick));
	}

	@Get('game/ranking')
	async getGameRanking(@GetJwt('sub') userId: number) {
		return this.pongGameMatchService.getGameRanking(userId);
	}


}
