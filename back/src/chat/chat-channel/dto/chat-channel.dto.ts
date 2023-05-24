import { IsString, IsOptional, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class ChatChannelDto {
	@ApiProperty()
	@IsNumber()
	@IsOptional()
	id: number

	@ApiProperty()
	@IsString()
	@IsOptional()
	name: string

	@ApiProperty()
	@IsOptional()
	isPrivate: boolean

	@ApiProperty()
	@IsString()
	@IsOptional()
	password?: string
}
