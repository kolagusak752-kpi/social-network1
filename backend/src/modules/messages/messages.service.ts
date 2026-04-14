import { Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateMessageDto } from "./dto/createDto";
import { CreateConverstaionDto } from "./dto/createConverstaionDto";

@Injectable()
export class MessageService {
  private prismaService: PrismaService;
  constructor(prismaService: PrismaService) {
    this.prismaService = prismaService;
  }

  async create(dto: CreateMessageDto) {
    return this.prismaService.message.create({ data: dto });
  }

  getParticipants(conversationId: string) {
    return this.prismaService.participant.findMany({ where: { conversationId } });
  }

  createConversation(userId: string, dto: CreateConverstaionDto) {
    const userIds = [userId, ...dto.userIds];
    return this.prismaService.conversation.create({ data: { participants: { createMany: { data: userIds.map((id) => ({ userId: id })) } } } });
  }
}