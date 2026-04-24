import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './messages.service';
import { PrismaService } from 'prisma/prisma.service';
import { FilesService } from '../cdn/files.service';
import { CreateConversationDto } from './dto/createConverstaionDto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) {}
  @UseGuards(AuthGuard('jwt'))
  @Get('getConversationList')
  getConversationList(@Req() req: any) {
    const userId = req.user.id;
    return this.prismaService.conversation.findMany({
      where: { participants: { some: { userId } } },
      include: {
        participants: {
          where: { userId: { not: userId } },
          include: {
            user: { select: { id: true, username: true, avatar: true } },
          },
        },
      },
    });
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('createConversation')
  createConversation(@Req() req: any, @Body() dto: CreateConversationDto) {
    console.log(req.user);
    const userId = req.user.id;

    return this.messageService.createConversation(userId, dto);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':conversationId/history')
  getMessages(@Param("conversationId") conversationId: string, @Req() req: any) {
    return this.messageService.getMessages(conversationId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('findOrCreateConversation/:userId')
  findOrCreateConversation(@Param('userId') userId: string, @Req() req: any) {
    return this.messageService.findOrCreateConversation(userId, req.user.id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Post("uploadAttachments")
  @UseInterceptors(FilesInterceptor('inputFiles', 10, {storage:memoryStorage()}))
  async uploadAttachments(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadPromises = files.map((file) => {
      return this.filesService.uploadFile(file)
    })
    const uploads = await Promise.all(uploadPromises)
    const fileUrls = uploads.map((res) => res.data.url)
    return fileUrls
  }
}
