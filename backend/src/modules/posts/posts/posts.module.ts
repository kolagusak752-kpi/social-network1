import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { FilesService } from 'src/modules/cdn/files.service';


@Module({
  controllers: [PostsController],
  providers: [PostsService, FilesService]
})
export class PostsModule {}
