import { Module } from '@nestjs/common';
import { ProxyAuthController } from './proxyAuth.controller';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [ProxyAuthController],
  providers: [],
})
export class ProxyAuthModule {}
