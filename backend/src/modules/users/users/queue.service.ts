import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy{
    private intervalId!: NodeJS.Timeout;
    constructor(private prismaService: PrismaService) {

    }
    onModuleInit() {
        this.intervalId = setInterval(() => {
            this.add(async () => { await this.prismaService.user.deleteMany({where: {isVerified: false}})})
        }, 1000 * 60 * 60 * 24)
    }
    private queue: any[] = [];
    isProcessing = false;
    add(task:any) {
        this.queue.push(task);
        if (!this.isProcessing) {
            this.process();
        }
    }
    async process() {
        if (this.queue.length === 0) return;
        if (this.isProcessing) return;
        this.isProcessing = true;
        const currentTask = this.queue.shift();
        try {
            const result = await currentTask();
            return result;
        } catch (error) {
            console.error("Error processing task:", error);
        } finally {
            this.isProcessing = false;
            this.process();
        }
    }
    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}
