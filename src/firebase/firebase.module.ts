// src/firebase/firebase.module.ts
import { Module } from '@nestjs/common';
import { FirebaseProvider } from './firebase.provider';

@Module({
    providers: [FirebaseProvider],
    exports: [FirebaseProvider], // Export để các module khác có thể sử dụng
})
export class FirebaseModule { }