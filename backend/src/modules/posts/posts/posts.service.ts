import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CacheService } from 'src/modules/users/users/cache.service';

@Injectable()
export class PostsService {
    constructor(private prismaService: PrismaService, private cacheService: CacheService) {}
    

    async sharePost(filesUrls: string[] | null, description:string, userId: string) {
        let mediaData: { create: any[] } | undefined = undefined
        if(filesUrls && filesUrls.length > 0) {
            mediaData = {
                create: filesUrls.map((url, index) => ({url: url, order: index, type: "IMAGE" }))
            }
        }
        const post = await this.prismaService.post.create({
            data: {
                authorId: userId,
                description,
                media: mediaData
            }, include: {media: true}
        });
        const cachedUser = this.cacheService.get(userId);
        if(cachedUser) {
            if(cachedUser.posts) {
                cachedUser.posts = [...cachedUser.posts, post];
            }
        }
        return post
    }
}
