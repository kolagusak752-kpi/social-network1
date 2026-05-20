import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { TransportService } from '../mail/transport.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET
    }),
  ],
  providers: [AuthService, JwtStrategy, TransportService],
  controllers: [AuthController],
  exports:[JwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
