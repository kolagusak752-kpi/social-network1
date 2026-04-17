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

  async checkUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      return true;
    }
    return false;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }

  async findUser(query: string, userId: string) {
    try {
      if (!query || query.length < 2) return [];
      const userData = await this.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      });
      if (!userData || userData.length === 0) {
        throw new NotFoundException('Користувача не знайдено');
      }
      const users = userData.map((user) => {
          const { passwordHash, ...userWithoutPassword } = user;
          return userWithoutPassword;

      }).filter((user) => user.id !== userId);

      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Користувачів не знайдено');
      }
    }
  }
}
