import { Module } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { MessageService } from "./messages.service";
import { MessagesController } from "./messages.controller";
import { PrismaModule } from "prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { MessagesGateway } from "./messages.gateway";

@Module({
    imports:[AuthModule],
    exports:[MessageService],
    controllers: [MessagesController],
    providers: [MessageService, MessagesGateway]
})
export class MessagesModule{}
