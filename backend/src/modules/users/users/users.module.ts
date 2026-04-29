import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { CacheService } from './cache.service';
import { FilesModule } from 'src/modules/cdn/files.module';
import { QueueService } from './queue.service';
import { AbstractUserService } from './abstract-user.service';
@Module({
  imports:[AuthModule,FilesModule],
  controllers: [UsersController],
  providers: [{ provide: AbstractUserService, useClass: CacheService },PrismaService, CacheService, QueueService]
})
export class UsersModule {}
