import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

  @Get('getConversationList')
  @UseGuards(AuthGuard('jwt'))
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

  @Post('createConversation')
  @UseGuards(AuthGuard('jwt'))
  createConversation(@Req() req: any, @Body() dto: CreateConverstaionDto) {
    console.log(req.user);
    const userId = req.user.id;

    return this.messageService.createConversation(userId, dto);
  }
}
