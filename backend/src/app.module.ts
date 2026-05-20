import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users/users.module';
import { MessagesModule } from './modules/messages/messages.module';
import { PostsModule } from './modules/posts/posts/posts.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MessagesModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
