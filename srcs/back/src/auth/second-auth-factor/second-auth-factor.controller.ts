import { Controller, Post, Body, UseGuards, Res, Get, Put, Delete } from '@nestjs/common';
import { SecondAuthFactorService } from './second-auth-factor.service';
import { Verify2faDto } from '../dto';
import { JwtGuard } from '../guard/jwt.guard';
import { Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetJwt } from '../decorator';


@UseGuards(JwtGuard)
@Controller('auth/second-auth-factor')
@ApiBearerAuth()
export class SecondAuthFactorController {
  constructor(private secondAuthFactorService: SecondAuthFactorService) {}

  @Get('enable')
  async enable2fa(@GetJwt('sub') userId: number, @Res() res: Response) {
    return this.secondAuthFactorService.enable2fa(userId, res);
  }

  @Get('disable')
  async disable2fa(@GetJwt('sub') userId: number) {
    return this.secondAuthFactorService.disable2fa(userId);
  }

  @Get('check')
  async check2fa(@GetJwt('sub') userId: number) {
    return this.secondAuthFactorService.check2fa(userId);
  }

  @Post('verify')
  async verify2fa(@GetJwt('sub') userId: number, @Body() verify2faDto: Verify2faDto) {
    console.log(userId);
    console.log(verify2faDto);
    return this.secondAuthFactorService.verify2fa(userId, verify2faDto);
  }

  @Get('verified')
  async isVerified2fa(@GetJwt('sub') userId: number) {
    return this.secondAuthFactorService.isVerified2fa(userId);
  }

  @Delete('verified')
  async deleteVerified2fa(@GetJwt('sub') userId: number) {
    return this.secondAuthFactorService.deleteVerified2fa(userId);
  }
}
