import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TransportService } from '../mail/transport.service';
import { last } from 'rxjs';

@Injectable()
export class NotificationsService {
    constructor(private prismaService: PrismaService,
        private transportService: TransportService
    ) {}
    async *generateUsersStream() {
        let lastUserId: string | undefined = undefined
        let hasMore = true

        while(hasMore) {
           const users =  await this.prismaService.user.findMany({
                take:100,
                cursor:lastUserId? {id:lastUserId}: undefined,
                skip: lastUserId? 1: 0,
                orderBy: {id:'asc'}
            })
            if(users.length === 0) {
                hasMore = false
            }
            lastUserId = users[users.length - 1].id
            for(const user of users) {
                yield user
            }
        }
    }
    async sendNotification() {
        for await(const user of this.generateUsersStream()) {
            await this.transportService.sendMail(user.email, "Це сповіщення для всіх користувачів")
        }
        
    }
}
