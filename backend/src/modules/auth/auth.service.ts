import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TransportService } from '../mail/transport.service';
import { VerificationDto } from './dto/verification.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private transportService: TransportService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const oldUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (oldUser) {
        throw new BadRequestException({
          message: 'Користувач з такою поштою вже існує',
        });
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const code = Math.floor(Math.random() * 900000 + 100000).toString();
      await this.prisma.user.create({
        data: {
          email: dto.email,
          passwordHash: hashedPassword,
          username: dto.username,
          verificationCode: code,
        },
      });

      await this.transportService.sendMail(dto.email, code);
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new BadRequestException({
          message: 'Користувач з такою поштою або іменем вже існує',
        });
      }
    }
    return { message: 'Реєстрація прошла успішно' };
  }
  async verify(dto: VerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new NotFoundException('Користувач з такою поштою не знайдений ');
    }
    if (user.verificationCode !== dto.code) {
      throw new BadRequestException('Неправильний код підтвердження');
    }
    await this.prisma.user.update({
      where: { email: dto.email },
      data: { isVerified: true, verificationCode:null},
    });
    return { message: 'Пошта підтверджена' };
  }

  async login(dto: LoginDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!oldUser) {
      throw new NotFoundException({
        message: 'Користувач з такою поштою не знайдений',
      });
    }
    if (oldUser.isVerified === false) {
      throw new BadRequestException('Пошта не підтверджена');
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
        deviceId: dto.deviceId,
      },
    });
    const tokens = await this.issueTokens(oldUser.id, dto.deviceId);
    const { passwordHash, ...userWithoutPassword } = oldUser;
    return { user: userWithoutPassword, ...tokens };
  }

  private async issueTokens(userId: string, deviceId: string) {
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
        deviceId: deviceId,
      },
    });
    return { accessToken, refreshToken };
  }
  async updateTokens(refreshToken: any) {
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
    const deviceId = tokenInDb.deviceId;
    await this.prisma.refreshToken.delete({
      where: { id: tokenInDb.id },
    });
    return this.issueTokens(payload.id, deviceId);
  }
  async logout(refreshToken, deviceId) {
    const tokenInDb = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenInDb) {
      throw new UnauthorizedException(
        'Рефреш токен не найден или уже был использован',
      );
    }
    await this.prisma.refreshToken.deleteMany({
      where: {
        deviceId: deviceId,
        userId: tokenInDb.userId,
      },
    });
  }
}
