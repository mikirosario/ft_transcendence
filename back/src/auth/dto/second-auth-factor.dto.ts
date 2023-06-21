import { ApiProperty } from "@nestjs/swagger";

export class Verify2faDto {
    @ApiProperty()
    code: number; // User-provided 2FA code for verification
}