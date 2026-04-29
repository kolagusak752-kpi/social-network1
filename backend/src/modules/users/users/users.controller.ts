import { Controller, Req, Post, Patch, Get, UseGuards, UseFilters, UseInterceptors, UploadedFile, Body, Query, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesService } from 'src/modules/cdn/files.service';
import { UpdateProfileDto } from './dto/updateProfile.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService, private readonly filesService: FilesService) {}

  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get("me")
  async getMe(@Req() req:any) {
    return this.userService.findUserById(req.user.id)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('profile/:userId')
  async getProfile(@Param("userId") userId:string) {
    return this.userService.findUserById(userId);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post("changeAvatar")
  @UseInterceptors(FileInterceptor('avatar', { storage: memoryStorage() }))
  async changeAvatar(@UploadedFile() file: Express.Multer.File, @Req() req:any) {

  if (!file) {
    throw new Error('Файл загубився по дорозі!');
  }
    const cdnData = await this.filesService.uploadFile(file)
    await this.userService.changeAvatar(cdnData.data.url , req.user.id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('updateProfile')
  async updateProfile(@Body() dto: UpdateProfileDto, @Req() req: any) {
    return this.userService.update(req.user.id, dto);
  }

  @Post("checkUsername")
  async checkUsername(@Body() dto: {username: string}) {
    const exists = await this.userService.checkUsername(dto.username);
    return { exists };
  }

  @Post("getProfileById")
  async getProfileById(@Body() dto: {id: string}) {
    return this.userService.findUserById(dto.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("findByUsername")
  async findUserByUsername(@Query() dto: {username: string}, @Req() req: any) {
    return this.userService.findUser(dto.username, req.user.id);
  }
}
