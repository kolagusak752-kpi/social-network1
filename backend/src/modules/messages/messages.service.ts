import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateMessageDto } from './dto/createDto';
import { CreateConversationDto } from './dto/createConverstaionDto';
import { last } from 'rxjs';

@Injectable()
export class MessageService {
  private prismaService: PrismaService;
  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async create(dto: CreateMessageDto) {
    const messageData: any = {
      message: dto.message,
      senderId: dto.senderId,
      conversationId: dto.conversationId,
    } 
    if(dto.attachments.length !==0) {
      messageData.attachments = {
        createMany: {
          data : dto.attachments.map((url) => ({URL:url,
            type:"IMAGE"}))
        }
      }   
  };
  return this.prismaService.message.create({data:messageData, include:{attachments:true, sender:true}});
  }

  getParticipants(conversationId: string) {
    return this.prismaService.participant.findMany({
      where: { conversationId },
    });
  }

  createConversation(userId: string, dto: CreateConversationDto) {
    const userIds = [userId, ...dto.userIds];
    return this.prismaService.conversation.create({
      data: {
        participants: {
          createMany: { data: userIds.map((id) => ({ userId: id })) },
        },
      },
    });
  }
  async getMessages(conversationId: string, userId: string) {
    const conversation = await this.prismaService.conversation.findFirst({
      where: { id: conversationId, participants: { some: { userId } } },
    });
    if (!conversation) throw new Error('У тебе немає доступу до цього чату');
    return this.prismaService.message.findMany({
      where: { conversationId },
      include: { sender: true, attachments:true },
    });
  }

  async findOrCreateConversation(userId, myUserId) {
    const userIds = [userId, myUserId];
    const conversation = await this.prismaService.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: myUserId } } },
          { participants: { some: { userId: userId } } },
        ],
        participants: { every: { userId: { in: userIds } } },
      },
      include: {
        messages: true,
        participants: { where: { userId: { not: myUserId } }, include: {
          user: { select: { id: true, username: true, avatar: true } },
        } },
      },
    });
    if (conversation) return conversation;
    return this.prismaService.conversation.create({
      data: {
        participants: {
          createMany: { data: userIds.map((id) => ({ userId: id })) },
        },
      },
    });
  }
  async *getMessagesGenerator(conversationId:string, amountOfMessages) {
    let lastMessageId: string | undefined = undefined
    let hasMore = true
    while(hasMore) {
      const messages = await this.prismaService.message.findMany({where:{
        conversationId: conversationId
      },take:amountOfMessages,
      skip:lastMessageId ? 1: 0,
      cursor: lastMessageId? {id: lastMessageId}: undefined,
      orderBy:{createdAt:"desc"}
    })
    if(messages.length < amountOfMessages) {
      hasMore = false
    }
    if(messages.length > 0) {
      lastMessageId = messages[messages.length - 1].id
      yield messages.reverse()
    }
    }
  }

}
