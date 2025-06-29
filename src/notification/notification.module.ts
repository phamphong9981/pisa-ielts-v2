// src/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from '../firebase/firebase.module'; // Import FirebaseModule

@Module({
    imports: [FirebaseModule], // Import để có thể inject Firebase Admin
    controllers: [NotificationController],
    providers: [NotificationService],
    exports: [NotificationService], // Export nếu bạn muốn dùng service này ở module khác
})
export class NotificationModule { }