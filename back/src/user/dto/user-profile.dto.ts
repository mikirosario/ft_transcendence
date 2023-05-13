import { IsNotEmpty, IsString, isEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"
import { File } from "buffer";

export class UserProfileDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	nick: string

	@ApiProperty()
	file: File
}
