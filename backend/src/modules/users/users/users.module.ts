import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaService } from 'prisma/prisma.service';
import { FilesModule } from 'src/modules/cdn/files.module';
@Module({
  imports:[AuthModule,FilesModule],
  controllers: [UsersController],
  providers: [UsersService,PrismaService]
})
export class UsersModule {}
