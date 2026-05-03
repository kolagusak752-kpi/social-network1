import { Module } from '@nestjs/common';
import { ProxyForwardController } from './proxyForward.controller';
import { SessionModule } from '../session/session.module';
import { AuthStrategyModule } from '../authStrategy/authStrategy.module';

@Module({
  imports: [SessionModule, AuthStrategyModule],
  controllers: [ProxyForwardController],
})
export class ProxyForwardModule {}
