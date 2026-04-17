import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './messages.service';
import { PrismaService } from 'prisma/prisma.service';
import { CreateConverstaionDto } from './dto/createConverstaionDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messageService: MessageService,
    private readonly prismaService: PrismaService,
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
  createConversation(@Req() req: any, @Body() dto: CreateConverstaionDto) {
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
}
