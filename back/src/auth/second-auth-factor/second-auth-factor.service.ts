import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { speakeasy } from 'speakeasy';

@Injectable()
export class SecondAuthFactorService {
  constructor(private readonly prisma: PrismaService) {}

  async enable2fa(userId: number): Promise<{ secretKey: string; otpAuthUrl: string }> {
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

    return { secretKey, otpAuthUrl };
  }

  async verify2fa(userId: number, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { secondFactorSecret: true },
    });

    // Verify the provided 2FA code against the user's stored secret key
    const verificationResult = speakeasy.totp.verify({
      secret: user.secondFactorSecret,
      encoding: 'base32',
      token: code,
    });

    return verificationResult;
  }
}