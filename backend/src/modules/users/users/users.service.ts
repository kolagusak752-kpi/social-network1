import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { CacheService } from './cache.service';
import { QueueService } from './queue.service';
import { FilesService } from 'src/modules/cdn/files.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
    private queue: QueueService,
    private filesService: FilesService,
  ) {}
  async findUserById(userId: string) {
    try {
      const cachedUser = this.cache.get(userId);
      if (cachedUser) {
        return cachedUser;
      }
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          avatars: {
            select: { originalAvatarUrl: true, url: true },
          },
          posts: {
            include: { media: true },
          },
        },
      });
      console.log(user);
      if (!user) {
        throw new NotFoundException('Користувач з таким айді не знайдений');
      }
      const { passwordHash, ...UserWithoutPassword } = user;
      this.cache.set(userId, UserWithoutPassword);
      return UserWithoutPassword;
    } catch (e) {
      console.log(e);
    }
  }

  async changeAvatar(
    avatarURLs: { croppedURL: string; originalURL: string | null },
    userId: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatars: { select: { originalAvatarUrl: true, url: true } } },
    });
    if (!user) {
      throw new NotFoundException('Користувач з таким айді не знайдений');
    }
    const cachedUser = this.cache.get(userId);
    if (cachedUser) {
      this.cache.delete(userId);
    }
    const updateData: any = { url: avatarURLs.croppedURL };
    if (avatarURLs.originalURL) {
      updateData.originalAvatarUrl = avatarURLs.originalURL;
    }

    const oldAvatars = user?.avatars;
    await this.prisma.media.upsert({
      where: { userId: userId },
      update: updateData,
      create: {
        originalAvatarUrl: avatarURLs.originalURL || avatarURLs.croppedURL,
        url: avatarURLs.croppedURL,
        userId: userId,
        type: 'AVATAR',
      },
    });
    const updatedUser = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { avatars: { select: { originalAvatarUrl: true, url: true } } },
    });
    if (!updatedUser) {
      throw new NotFoundException('Користувач з таким айді не знайдений');
    }
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    this.cache.set(userId, userWithoutPassword);
    this.queue.add(async () => {
      if (avatarURLs.originalURL && oldAvatars?.originalAvatarUrl) {
        await this.filesService.deleteFile(oldAvatars.originalAvatarUrl);
      }
      if (oldAvatars?.url) {
        await this.filesService.deleteFile(oldAvatars.url);
      }
    });
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Користувач з таким айді не знайдений');
    }
    const cachedUser = this.cache.get(userId);
    if (cachedUser) {
      this.cache.delete(userId);
    }
    this.cache.delete(userId);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      include: {
        avatars: { select: { originalAvatarUrl: true, url: true } },
        posts: { include: { media: true } },
      },
    });
    const { passwordHash, ...result } = updatedUser;
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
          username: { contains: query, mode: 'insensitive' },
        },
        include: { avatars: { select: { url: true } } },
      });
      if (!userData || userData.length === 0) {
        throw new NotFoundException('Користувача не знайдено');
      }
      const users = userData
        .map((user) => {
          const {
            passwordHash,
            email,
            createdAt,
            isVerified,
            isPrivate,
            updatedAt,
            ...userWithoutPassword
          } = user;
          return userWithoutPassword;
        })
        .filter((user) => user.id !== userId);

      return users;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Користувачів не знайдено');
      }
    }
  }
}
