import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {

    
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (oldUser) {
      throw new BadRequestException({
        message: 'Пользователь с такой почтой уже зарегистрирован ',
      });
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        username: dto.username,
      },
    });
    const tokens = await this.issueTokens(user.id, dto.deviceId);
    const { passwordHash, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new BadRequestException({
        message: 'Користувач з такою поштою або іменем вже існує',
      });
    }
    throw error;
  }
}

  async login(dto: LoginDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!oldUser) {
      throw new NotFoundException({
        message: 'Пользователь с такой почтой не найден',
      });
    }
    const passwordMatch = await bcrypt.compare(
      dto.password,
      oldUser.passwordHash,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException({
        message: 'Неверный пароль',
      });
    }
    await this.prisma.refreshToken.deleteMany({
      where: {
        deviceId: dto.deviceId
      }
    })
    const tokens = await this.issueTokens(oldUser.id,dto.deviceId);
    const { passwordHash, ...userWithoutPassword } = oldUser;
    return { user: userWithoutPassword, ...tokens };
  }

  private async issueTokens(userId: string, deviceId:string) {
    const payload = { id: userId };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: userId,
        expiresAt: expiresAt,
        deviceId:deviceId
      },
    });
    return { accessToken, refreshToken };
  }
  async updateTokens(refreshToken:any) {
    const payload = await this.jwt
      .verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      })
      .catch(() => {
        throw new UnauthorizedException(
          'Рефреш токен не валиден или просрочен',
        );
      });
    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });
    if (!tokenInDb) {
      throw new UnauthorizedException(
        'Рефреш токен не найден или уже был использован',
      );
    }
    const deviceId = tokenInDb.deviceId
    await this.prisma.refreshToken.delete({
      where: { id: tokenInDb.id },
    });
    return this.issueTokens(payload.id, deviceId);
  }
  async logout(dto: RefreshDto) {
    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
    });

    if (!tokenInDb) {
      throw new UnauthorizedException(
        'Рефреш токен не найден или уже был использован',
      );
    }
    await this.prisma.refreshToken.deleteMany({
      where: {
        deviceId: dto.deviceId
      }})

    await this.prisma.refreshToken.delete({
      where: { id: tokenInDb.id },
    });
  }
}
