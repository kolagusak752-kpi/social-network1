import { Injectable } from "@nestjs/common";

@Injectable()
export class QueueService {
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
}