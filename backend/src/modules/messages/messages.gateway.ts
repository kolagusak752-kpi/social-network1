import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from './messages.service';
import { FilesService } from '../cdn/files.service';
import { OnGatewayConnection } from '@nestjs/websockets';
@WebSocketGateway({
  cors: { origin: ['http://localhost:3000'], credentials: true },
})
export class MessagesGateway implements OnGatewayConnection,OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  private chatGenerators = new Map()
  constructor(
    private readonly jwt: JwtService,
    private readonly messageService: MessageService,
    private readonly filesService: FilesService,
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
    @MessageBody()
    data: { message: string; attachments: string[], conversationId: string; tempId: string },
  ) {
    try {
      const savedMessage = await this.messageService.create({
        message: data.message,
        senderId: client.data.userId,
        conversationId: data.conversationId,
        attachments: data.attachments
      });

      const participants = await this.messageService.getParticipants(
        data.conversationId,
      );

      for (const participant of participants) {
        this.server
          .to(`user:${participant.userId}`)
          .except(client.id)
          .emit('message:new', { savedMessage });
      }
      return { ok: true, tempId: data.tempId, message: savedMessage };
    } catch (e) {
      return { ok: false, tempId: data.tempId, error: 'send_failed' };
    }
  }

  @SubscribeMessage('chat:join')
  async chatJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {conversationId:string}
  ) {
    try{
      const generator = await this.messageService.getMessagesGenerator(data.conversationId, 15)
      this.chatGenerators.set(client.id, generator)
      const firstBatch = await generator.next()
      return {ok:true,messages: firstBatch.value || [],
        hasMore: !firstBatch.done}
    } catch(e) {
      return {ok:false, error:'chat_join_failed'}
    }
  }
  @SubscribeMessage('chat:loader') 
  async chatLoader(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {conversationId:string}
  ) {
    try{
      const generator = this.chatGenerators.get(client.id)
      if(!generator) return {ok:false, error:'no_generator'}
      const nextBatch = await generator.next()
      if(nextBatch.done) {
        this.chatGenerators.delete(client.id)
      }
      
      return {ok:true, messages:nextBatch.value || [], hasMore: !nextBatch.done}
    } catch(e) {
      return {ok:false, error:'chat_loader_failed'}
    }
  }
  handleDisconnect(client: Socket) {
    this.chatGenerators.delete(client.id)
  }
}
