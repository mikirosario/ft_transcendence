import { Module } from '@nestjs/common';
import { SecondAuthFactorController } from './second-auth-factor.controller';
import { SecondAuthFactorService } from './second-auth-factor.service';

@Module({
    controllers: [SecondAuthFactorController],
    providers: [SecondAuthFactorService],
  })
  export class SecondAuthFactorModule {}