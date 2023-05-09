import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class UserProfileDto {
	@ApiProperty()
	@IsString()
	nick: string
}
