import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { SecondAuthFactorService } from './second-auth-factor.service';
import { Enable2faDto, Verify2faDto } from '../dto';
import { JwtGuard } from '../guard/jwt.guard';

@Controller('second-auth-factor')
@UseGuards(JwtGuard)
export class SecondAuthFactorController {
  constructor(private readonly secondAuthFactorService: SecondAuthFactorService) {}

  @Post('enable')
  async enable2fa(@Body() enable2faDto: Enable2faDto, @Req() req: any): Promise<any> {
    const { secretKey, otpAuthUrl } = await this.secondAuthFactorService.enable2fa(req.user.id);
    // Here, you can return the secret key and OTP auth URL to the client
    return { secretKey, otpAuthUrl };
  }

  @Post('verify')
  async verify2fa(@Body() verify2faDto: Verify2faDto, @Req() req: any): Promise<any> {
    const isValid = await this.secondAuthFactorService.verify2fa(req.user.id, verify2faDto.code);
    // Here, you can return the verification result to the client
    return { isValid };
  }
}