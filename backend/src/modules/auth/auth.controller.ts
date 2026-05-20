import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerificationDto } from './dto/verification.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  hello() {
    console.log('hello');
  }

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: any) {
      console.log(dto);
      return await this.authService.register(dto, req);

  }
  @Post('verify')
  async verify(@Body() dto: VerificationDto) {
    return this.authService.verify(dto);
  }
    @Post('login')
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any, @Req() req: any) {
      const data = await this.authService.login(dto, req);
      res.cookie('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return data;
    }

  @HttpCode(200)
  @Post('refresh')
  async getNewTokens(@Body() body: { refreshToken: string; deviceId: string }, @Req() req: any) {
    return this.authService.updateTokens(body.refreshToken, req);
  }

  @Post('logout')
  logout(@Body() body: { refreshToken: string; deviceId: string }, @Req() req: any) {
    return this.authService.logout(body.refreshToken, body.deviceId, req);
  }
}
