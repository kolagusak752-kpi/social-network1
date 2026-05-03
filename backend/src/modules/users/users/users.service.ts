import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService} from 'prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { CacheService } from './cache.service';
import { QueueService } from './queue.service';
import { FilesService } from 'src/modules/cdn/files.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private cache: CacheService, private queue: QueueService, private filesService: FilesService) {}
  async findUserById(userId: string) {
    try{
      const cachedUser = this.cache.get(userId);
      if (cachedUser) {
        return cachedUser;
      }
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
    if (!user) {
      throw new NotFoundException('Пользователь с этим айди не найден');
    }
    const { passwordHash, ...UserWithoutPassword } = user;
    this.cache.set(userId, UserWithoutPassword);
    return UserWithoutPassword;
  }catch(e) {
   console.log(e)
  }
  }

  async changeAvatar(avatarURL: string, userId: string) {
    const oldAvatar = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { avatar: true },
    })
    await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: avatarURL },
      });
    this.queue.add(async () => {
      if(oldAvatar?.avatar) {
        await this.filesService.deleteFile(oldAvatar.avatar);
      }
    });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Пользователь с этим айди не найден');
    }
    this.cache.delete(userId);
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const { passwordHash, ...result } = updated;
    this.cache.set(userId, result);
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
          const { passwordHash, email, createdAt, isVerified, isPrivate, updatedAt, ...userWithoutPassword } = user;
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
