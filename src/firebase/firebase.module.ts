// src/firebase/firebase.module.ts
import { Module } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';
import { FirebaseService } from './firebase.service';
import { FirebaseController } from './firebase.controller';
import { UserHttpModule } from '../users/user-http.module';

@Module({
    imports: [UserHttpModule],
    controllers: [FirebaseController],
    providers: [FirebaseProvider, FirebaseService],
    exports: [FirebaseProvider, FirebaseService], // Export để các module khác có thể sử dụng
})
export class FirebaseModule { }