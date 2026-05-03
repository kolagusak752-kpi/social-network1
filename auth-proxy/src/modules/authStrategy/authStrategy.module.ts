import { Module } from '@nestjs/common';
import { AuthStrategyService } from './authStrategy.service';

@Module({
  providers: [AuthStrategyService],
  exports: [AuthStrategyService],
})
export class AuthStrategyModule {}
