import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async findUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с этим айди не найден');
    }
    const { passwordHash, ...UserWithoutPassword } = user;
    return UserWithoutPassword;
  }
  async changeAvatar(avatarURL: string, userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarURL },
    });
  }


  //TODO: Сделать метод который будет выводить не занят ли username другим пользователем + тут выводить ошибку из неста(особенную)
  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь с этим айди не найден');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const { passwordHash, ...result } = updated;
    return result;
  }
}
