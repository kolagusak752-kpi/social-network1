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
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  hello() {
    console.log('hello');
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
      const user = await this.authService.register(dto);
      return user;
  }
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: any) {
    const data = await this.authService.login(dto);

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
  async getNewTokens(@Req() req: any, @Res({ passthrough: true }) res: any) {
    //eslint-disable-next-line
    const refreshToken = req.cookies.refreshToken

    const data = await this.authService.updateTokens(refreshToken);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return data;
  }

  @Post('logout')
  logout(@Req() req:any, @Body() deviceId:string) {
    const refreshToken = req.cookies.refreshToken
    return this.authService.logout(refreshToken, deviceId);
  }
}
