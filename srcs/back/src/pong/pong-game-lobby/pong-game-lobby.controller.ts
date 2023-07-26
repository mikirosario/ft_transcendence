import { Controller, UseGuards, Body, Post, Delete } from "@nestjs/common";
import { ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { JwtGuard } from "../../auth/guard";
import { GetJwt } from "../../auth/decorator";
import { PongGameLobbyService } from "./pong-game-lobby.service";
import { PongGameLobbyDto } from './dto'


@UseGuards(JwtGuard)
@Controller('game/lobby')
@ApiBearerAuth()
export class PongGameLobbyController {
	
	constructor(private pongGameLobbyService: PongGameLobbyService) { }

}
