import { Controller, UploadedFiles, UseInterceptors, Body, UseGuards, Req } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { memoryStorage } from 'multer';
import { PostsService } from './posts.service';
import { FilesService } from 'src/modules/cdn/files.service';
@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService, private filesService: FilesService) {}
@Post("sharePost")
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(
    FilesInterceptor("post-files", 4, {storage:memoryStorage()} )
)
async sharePost(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
    @Body("post-description") postText
) {
    let filesUrls: string[] = []
    if(files && files.length > 0) {
    const uploadPromises = files.map((file) => this.filesService.uploadFile(file))
    const uploads = await Promise.all(uploadPromises)
    filesUrls = uploads.map(upload => upload.data.url)
    }
    return this.postsService.sharePost(filesUrls, postText, req.user.id)
}

}
