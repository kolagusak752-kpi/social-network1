import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ProxyAuthModule } from './modules/proxyAuth/proxyAuth.module';
import { ProxyForwardModule } from './modules/proxyForward/proxyForward.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 100,
    }]),
    ProxyAuthModule,
    ProxyForwardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
