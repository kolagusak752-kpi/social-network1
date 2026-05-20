import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prismaService: PrismaService) {
    }

    async sharePost(filesUrls: string[] | null, description:string, userId: string) {
        let mediaData: { create: any[] } | undefined = undefined
        if(filesUrls && filesUrls.length > 0) {
            mediaData = {
                create: filesUrls.map((url, index) => ({url: url, order: index, type: "IMAGE" }))
            }
        }
        return await this.prismaService.post.create({
            data: {
                authorId: userId,
                description,
                media: mediaData
            }, include: {media: true}
        });
    }
}
