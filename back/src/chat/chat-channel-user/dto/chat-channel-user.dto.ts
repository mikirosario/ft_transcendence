import { IsOptional, IsNumber, IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class ChatChannelUserDto {

	@ApiProperty()
	@IsNumber()
	id: number

	@ApiProperty()
	@IsNumber()
	user_id: number

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	isAdmin?: boolean

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	isBanned?: boolean
}
