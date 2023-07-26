import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class PongGameLobbyDto {

	@ApiProperty()
	@IsNumber()
	userId: number
}
