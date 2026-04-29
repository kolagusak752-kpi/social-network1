import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { CacheService } from './cache.service';
import { FilesModule } from 'src/modules/cdn/files.module';
import { QueueService } from './queue.service';
@Module({
  imports:[AuthModule,FilesModule],
  controllers: [UsersController],
  providers: [UsersService,PrismaService, CacheService, QueueService]
})
export class UsersModule {}
