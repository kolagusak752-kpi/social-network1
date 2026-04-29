import {
  Body,
  Controller,
  HttpException,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { SessionService } from '../session/session.service';
import { RegisterDto } from './dto/register.dto';
import { randomUUID } from 'crypto';
import { VerificationDto } from './dto/verification.dto';

@Controller('proxy')
export class ProxyAuthController {
  private readonly apiUrl: string;

  constructor(private sessionService: SessionService) {
    this.apiUrl = process.env.API_URL!;
  }

  private async forwardRequest(url: string, body: unknown): Promise<any> {
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      throw new InternalServerErrorException('Backend service is unavailable');
    }
    const data = await response.json();
    if (!response.ok) {
      throw new HttpException(data, response.status);
    }
    return data;
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const sessionId = randomUUID();
    const data = await this.forwardRequest(`${this.apiUrl}/auth/login`, {
      ...dto,
      deviceId: sessionId,
    });

    this.sessionService.createSession(
      {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        strategy: 'jwt',
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
      },
      sessionId,
    );

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return data.user;
  }

  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: any) {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      throw new UnauthorizedException('No session');
    }

    const session = this.sessionService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found or expired');
    }

    await this.forwardRequest(`${this.apiUrl}/auth/logout`, {
      refreshToken: session.refreshToken,
      deviceId: sessionId,
    });

    this.sessionService.deleteSession(sessionId);
    res.clearCookie('sessionId');
    return { message: 'Logout successful' };
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.forwardRequest(`${this.apiUrl}/auth/register`, dto);
  }

  @Post('verify')
  async verify(@Body() dto: VerificationDto) {
    return this.forwardRequest(`${this.apiUrl}/auth/verify`, dto);
  }
}
