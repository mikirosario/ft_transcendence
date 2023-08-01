import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { Verify2faDto } from '../dto';

@Injectable()
export class SecondAuthFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async enable2fa(userId: number,  res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true , id: true},
    });

    if (!user)
    {
      throw new NotFoundException('User not found');
    }
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
      select: {secondFactorSecret: true},
    });

    if (user.secondFactorSecret == null)
      return { checkresult: false };
    
    return { checkresult: true };
  }

  async verify2fa(userId: number, verify2faDto: Verify2faDto): Promise<{ verificationResult: boolean }> {
    let user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { secondFactorSecret: true },
    });
    
    // Verify the provided 2FA code against the user's stored secret key
    const verificationResult = speakeasy.totp.verify({
      secret: user.secondFactorSecret,
      encoding: 'ascii',
      token: verify2faDto.code
    });

    user = await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified2fa: true },
    });

    return { verificationResult };
  }

  async isVerified2fa(userId: number): Promise<{isVerified2fa: boolean}> {

    const user = await this.prisma.user.findUnique({
                    where: { id: userId },
                    select: {isVerified2fa: true},
    });
    
    return { isVerified2fa: user.isVerified2fa };
  }
  
  async deleteVerified2fa(userId: number) {

    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified2fa: false },
    });
    
  }

}
