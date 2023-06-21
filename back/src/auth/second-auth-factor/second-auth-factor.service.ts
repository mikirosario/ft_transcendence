import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Response } from 'express';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

@Injectable()
export class SecondAuthFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async enable2fa(userId: number,  res: Response): Promise<{ secretKey: string; otpAuthUrl: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true , id: true},
    });

    if (!user)
    {
      throw new NotFoundException('User not found');
    }
    // Generate a new secret key for the user
    const secretKey = speakeasy.generateSecret({ length: 20 }).base32;

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
    });

    const qrCodeImageBuffer = await qrcode.toBuffer(otpAuthUrl);
    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", qrCodeImageBuffer.length.toString());
    res.send(qrCodeImageBuffer);

    return { secretKey, otpAuthUrl };
  }

  async verify2fa(userId: number, code: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { secondFactorSecret: true },
    });
    console.log(code);
    console.log(user.secondFactorSecret);
    // Verify the provided 2FA code against the user's stored secret key
    const verificationResult = speakeasy.totp.verify({
      secret: user.secondFactorSecret,
      encoding: 'base32',
      token: code,
    });

    return verificationResult;
  }
}