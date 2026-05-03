import { Module } from '@nestjs/common';
import { ProxyAuthController } from './proxyAuth.controller';
import { ProxyAuthService } from './proxyAuth.service';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [ProxyAuthController],
  providers: [ProxyAuthService],
})
export class ProxyAuthModule {}
