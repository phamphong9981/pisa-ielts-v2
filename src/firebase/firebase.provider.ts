// src/firebase/firebase.provider.ts
import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const FirebaseProvider: Provider = {
    provide: 'FIREBASE_ADMIN', // Tên để inject
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        // Nếu đã khởi tạo rồi thì không khởi tạo lại
        if (admin.apps.length > 0) {
            return admin.app();
        }

        // Cách 1: Dùng Service Account Key Path từ .env (đơn giản hơn)
        const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_KEY_PATH');
        if (!serviceAccountPath) {
            console.warn('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set in .env file. Firebase will be disabled.');
            return null; // Return null if Firebase is not configured
        }

        try {
            return admin.initializeApp({
                credential: admin.credential.cert(serviceAccountPath),
                // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com' // Nếu bạn dùng Realtime Database
            });
        } catch (error) {
            console.error('Failed to initialize Firebase:', error);
            return null;
        }

        /*
        // Cách 2: Dùng các biến môi trường riêng lẻ (an toàn hơn cho môi trường production/docker)
        // Bạn cần lấy các giá trị projectId, privateKey, clientEmail từ file JSON và đưa vào .env
        return admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });
        */
    },
};