import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    async findUserById(userId:string) {
        const user = await this.prisma.user.findUnique({
            where: {id: userId}
        })
        if(!user) {
            throw new NotFoundException("Пользователь с этим айди не найден")
        }
        const { passwordHash, ...UserWithoutPassword } = user;
    return UserWithoutPassword ;
    }

}
