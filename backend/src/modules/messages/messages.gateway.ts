import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './messages.service';
import { OnGatewayConnection } from '@nestjs/websockets';

@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'], credentials: true },
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly messageService: MessageService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.auth?.token;
    try {
      const payload = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.userId = payload.id;

      client.join(`user:${payload.id}`);
    } catch (error) {
      client.disconnect();
    }
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {message: string, conversationId:string}
  ) {
    try {
      const savedMessage = await this.messageService.create({
        message:data.message,
        senderId: client.data.userId,
        conversationId: data.conversationId,
      });

      const participants = await this.messageService.getParticipants(
        data.conversationId,
      );

      for (const participant of participants) {
        this.server
          .to(`user:${participant.userId}`)
          .emit('message:new', {savedMessage});
      }
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
