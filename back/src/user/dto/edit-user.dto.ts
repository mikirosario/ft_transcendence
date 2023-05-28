import { IsEmail, IsString, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger"

export class EditUserDto {
	@ApiProperty()
	@IsEmail()
	@IsOptional()
	email?: string
}
