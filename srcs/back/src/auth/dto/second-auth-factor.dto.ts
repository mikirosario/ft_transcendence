import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class Verify2faDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    code: string // User-provided 2FA code for verification
}
