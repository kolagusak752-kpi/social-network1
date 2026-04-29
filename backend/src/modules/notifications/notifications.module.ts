import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TransportService } from '../mail/transport.service';
@Module({
imports: [],
providers: [NotificationsService, TransportService],
controllers: [NotificationsController],
exports: []
})
export class NotificationsModule {
}
