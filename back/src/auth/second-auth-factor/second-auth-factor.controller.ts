import { Controller, Get, Post, Body, Req, UseGuards, Res } from '@nestjs/common';
import { SecondAuthFactorService } from './second-auth-factor.service';
import { Verify2faDto } from '../dto';
import { JwtGuard } from '../guard/jwt.guard';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GetJwt } from '../decorator';

@UseGuards(JwtGuard)
@Controller('auth/second-auth-factor')
@ApiBearerAuth()
export class SecondAuthFactorController {
  constructor(private readonly secondAuthFactorService: SecondAuthFactorService) {}

  @Post('enable')
  async enable2fa( @GetJwt('sub') userId: number, @Res() res: Response): Promise<any> {
    return await this.secondAuthFactorService.enable2fa(userId, res);
    // Here, you can return the secret key and OTP auth URL to the client
  }

  @Post('verify')
  @ApiBody({type: Verify2faDto})
  async verify2fa( @GetJwt('sub') userId: number, @Body() verify2faDto: Verify2faDto): Promise<any> {
    console.log(verify2faDto)
    return await this.secondAuthFactorService.verify2fa(userId, verify2faDto.code);
    // Here, you can return the verification result to the client
  }
}