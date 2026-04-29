import { Module } from '@nestjs/common';
import { SessionModule } from './modules/session/session.module';
import { AuthStrategyModule } from './modules/authStrategy/authStrategy.module';
import { ProxyAuthModule } from './modules/proxyAuth/proxyAuth.module';
import { ProxyForwardModule } from './modules/proxyForward/proxyForward.module';

@Module({
  imports: [SessionModule, AuthStrategyModule, ProxyAuthModule, ProxyForwardModule],
})
export class AppModule {}
