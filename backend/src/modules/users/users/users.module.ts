import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { CacheService } from './cache.service';
import { FilesModule } from 'src/modules/cdn/files.module';
import { QueueService } from './queue.service';
import { Global } from '@nestjs/common';
@Global()
@Module({
  imports:[AuthModule,FilesModule],
  controllers: [UsersController],
  providers: [ PrismaService, CacheService, QueueService, UsersService],
  exports: [UsersService, CacheService]
})
export class UsersModule {}
