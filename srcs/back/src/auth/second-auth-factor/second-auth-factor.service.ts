import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Verify2faDto } from '../dto';
import { ThrowHttpException } from '../../utils/error-handler';
import { Res } from '@nestjs/common';
import { OAuthService } from '../../oauth/oauth.service';

@Injectable()
export class SecondAuthFactorService {
  constructor(private readonly prisma: PrismaService,
    private oAuthService: OAuthService) {}

  async enable2fa(userId: number,  res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true , id: true},
    });

    if (!user)
      throw new NotFoundException('User not found');
    // Generate a new secret key for the user
    const secretKey = speakeasy.generateSecret({ length: 20 }).ascii;

    // Save the secret key in the database
    await this.prisma.user.update({
      where: { id: user.id },
      data: { secondFactorSecret: secretKey },
    });

    // Generate the OTP auth URL for the user to scan with the Google Authenticator app
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: secretKey,
      label: user.email,
      algorithm: 'SHA1',
      issuer: '42 Pong',
    });

    const qrCodeImageBuffer = await qrcode.toDataURL(otpAuthUrl);
    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", qrCodeImageBuffer.length.toString());
    res.send(qrCodeImageBuffer);
  }

  async disable2fa(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: {id: userId},
      data: {secondFactorSecret: null},
    });
  }

  async check2fa(userId: number): Promise<{checkresult: boolean}> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId},
      select: { secondFactorSecret: true },
    });

    if (!user)
      ThrowHttpException(new UnauthorizedException, 'Usuario no encontrado');

    if (user.secondFactorSecret == null)
      return { checkresult: false };
    
    return { checkresult: true };
  }

  async verify2fa(@Res() res, verify2faDto: Verify2faDto) {

    let user = await this.prisma.user.findUnique({
      where: { id: verify2faDto.userId },
      select: {
                id: true,
                email: true,
                secondFactorSecret: true
              },
    });

    if (!user)
      ThrowHttpException(new UnauthorizedException, 'Usuario no encontrado');
      
    if (user.secondFactorSecret) {
      // Verify the provided 2FA code against the user's stored secret key
      const verificationResult = speakeasy.totp.verify({
        secret: user.secondFactorSecret,
        encoding: 'ascii',
        token: verify2faDto.code
      });

      console.log("asdasdasd")
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isVerified2fa: verificationResult },
      });

      if (verificationResult == false)
        ThrowHttpException(new UnauthorizedException, 'Código incorrecto. Vuelve a intentarlo.');
  
    }

    let { access_token } = await this.oAuthService.signToken(user.id, user.email);
    console.log("access_token")
    return {asdasd: "asd"};
    
  }

  async isVerified2fa(userId: number): Promise<{isVerified2fa: boolean}> {

    const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: {
                      isVerified2fa: true,
                      secondFactorSecret: true
                     },
    });

    if (!user)
      ThrowHttpException(new UnauthorizedException, 'Usuario no encontrado');

    if (user.secondFactorSecret)
      return { isVerified2fa: user.isVerified2fa };
    
    return { isVerified2fa: true };
  }
  
  async deleteVerified2fa(userId: number) {

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        secondFactorSecret: true
       },
    });

    if (!user)
      ThrowHttpException(new UnauthorizedException, 'Usuario no encontrado');

    if (user.secondFactorSecret)
    {
      await this.prisma.user.update({
        where: { id: userId },
        data: { isVerified2fa: false },
      });
    }
  }

}
