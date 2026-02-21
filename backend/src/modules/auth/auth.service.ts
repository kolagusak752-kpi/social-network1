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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (oldUser) {
      throw new BadRequestException({
        message: "Пользователь с такой почтой уже зарегистрирован "
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
    const tokens = await this.issueTokens(user.id);
    return {
      user,
      ...tokens,
    };
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
    const tokens = await this.issueTokens(oldUser.id);
  }
  private async issueTokens(userId: string) {
    const data = { id: userId };
    const accessToken = await this.jwt.sign(data);
    return { accessToken };
  }
}
