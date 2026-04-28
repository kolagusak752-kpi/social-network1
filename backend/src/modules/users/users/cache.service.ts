import { Injectable } from "@nestjs/common";
import { LampWallDown } from "lucide-react";

@Injectable()
export class CacheService {
    cache: Map<string, any> = new Map();
    maxSize = 1000;

    set(userId: string, data: any) {
        if (this.cache.size >= this.maxSize) {
            this.removeLFU()
            this.removeExpired();
        }
        const key = `user_profile_${userId}`;
        const ttl = 60 * 60 * 1000; 
        const expiresAt = Date.now() + ttl;
        this.cache.set(key, {data, expiresAt, lastUsed: Date.now(), usageCount: 0});
    }
    get(userId: string) {
        const key = `user_profile_${userId}`;
        const cached = this.cache.get(key);
        if (cached) {
            if (cached.expiresAt > Date.now()) {
                cached.lastUsed = Date.now();
                cached.usageCount += 1;
                return cached.data;
            } else {
                this.cache.delete(key);
            }
        }
        return null;
    }
    delete(userId: string) {
        const key = `user_profile_${userId}`;
        this.cache.delete(key);
    }
    removeExpired() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (value.expiresAt < now) {
                this.cache.delete(key);
            }
        }
    }
    removeLFU() {
        let lfuKey: string | null = null;
        let minUsage = Infinity;
        for (const [key, value] of this.cache.entries()) {
            if (value.usageCount < minUsage) {
                minUsage = value.usageCount;
                lfuKey = key;
            }
        }
        if (lfuKey) {
            this.cache.delete(lfuKey);
        }
    }
}