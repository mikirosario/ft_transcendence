import { IsNotEmpty, IsString, isEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class UserProfileDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	nick: string
}
