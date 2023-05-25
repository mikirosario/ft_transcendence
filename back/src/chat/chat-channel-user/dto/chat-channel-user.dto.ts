import { IsString, IsOptional, IsNumber, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChatChannelUserDto {

	@ApiProperty()
	@IsNumber()
	id: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	password?: string
}
