import { Controller, Req, Post, Get, UseGuards, UseFilters, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesService } from 'src/modules/cdn/files.service';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly filesService: FilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.userService.findUserById(req.user.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post("changeAvatar")
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async changeAvatar(@UploadedFile() file: Express.Multer.File, @Req() req:any) {
    console.log('--- ЧТО ПРИШЛО НА БЭК? ---', file);

  if (!file) {
    throw new Error('Файл потерялся по дороге!');
  }
    const cdnData = await this.filesService.uploadFile(file)
    await this.userService.changeAvatar(cdnData.data.url , req.user.id)
  }
}
