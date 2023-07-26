import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class PongGameMatchDto {

	@ApiProperty()
	@IsNumber()
	user1Id: number

	@ApiProperty()
	@IsNumber()
	user2Id: number
}
