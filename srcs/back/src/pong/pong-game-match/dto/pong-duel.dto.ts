import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class PongDuelDto {
	@ApiProperty()
	@IsNumber()
	otherUserId: number
}