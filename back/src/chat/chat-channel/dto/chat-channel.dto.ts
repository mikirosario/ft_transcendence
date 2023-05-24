import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class ChatChannelDto {
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
