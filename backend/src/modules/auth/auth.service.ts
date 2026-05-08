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
import {Logger} from "../../decorators/log.decorator";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private transportService: TransportService,
  ) {}
  
  @Logger({level: 'info', mode: 'file'})
  async register(dto: RegisterDto, req: any = null) {
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
      console.log(`Код для ${dto.email}: ${code}`);
      await this.transportService.sendMail(dto.email, code);
    } catch (error: any) {
        throw new BadRequestException({
          message: 'Користувач з такою поштою або іменем вже існує',
        });
    }
    return { message: 'Реєстрація прошла успішно' };
  }
  @Logger({level: 'info', mode: 'file'})
  async verify(dto: VerificationDto, req: any = null) {
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
  @Logger({level: 'info', mode: 'file'})
  async login(dto: LoginDto, req: any = null) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { avatars: { select: { originalAvatarUrl: true, url: true } } },
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
        message: 'Неправильний пароль',
      });
    }
    const tokens = await this.issueTokens(oldUser.id, dto.deviceId);
    const { passwordHash, ...userWithoutPassword } = oldUser;
    return { user: userWithoutPassword, ...tokens };
  }
  @Logger({level: 'info', mode: 'file'})
  private async issueTokens(userId: string, deviceId: string, req: any = null) {
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
  @Logger({level: 'info', mode: 'file'})
  async updateTokens(refreshToken: any, req: any = null) {
    const payload = await this.jwt
      .verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      })
      .catch(async () => {
        await this.prisma.refreshToken.deleteMany({
          where: { token: refreshToken },
        });
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
  @Logger({level: 'info', mode: 'console'})
  async logout(refreshToken, deviceId, req: any = null) {
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
