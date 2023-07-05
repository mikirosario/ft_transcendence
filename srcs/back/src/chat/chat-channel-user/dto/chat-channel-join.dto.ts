import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class ChatChannelJoinDto {

	@ApiProperty()
	@IsNumber()
	id: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	password?: string
}
