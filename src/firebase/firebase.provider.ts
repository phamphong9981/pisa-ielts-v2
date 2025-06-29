// src/firebase/firebase.provider.ts
import * as admin from 'firebase-admin';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const FirebaseProvider: Provider = {
    provide: 'FIREBASE_ADMIN', // Tên để inject
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
        const firebaseConfig = {
            projectId: process.env.FIREBASE_PROJECT_ID, // Có thể lấy từ file key hoặc .env
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Tương tự
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL, // Tương tự
        };

        // Nếu đã khởi tạo rồi thì không khởi tạo lại
        if (admin.apps.length > 0) {
            return admin.app();
        }

        // Cách 1: Dùng Service Account Key Path từ .env (đơn giản hơn)
        const serviceAccountPath = configService.get<string>('FIREBASE_SERVICE_ACCOUNT_KEY_PATH');
        if (!serviceAccountPath) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY_PATH is not set in .env file');
        }

        return admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath),
            // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com' // Nếu bạn dùng Realtime Database
        });

        /*
        // Cách 2: Dùng các biến môi trường riêng lẻ (an toàn hơn cho môi trường production/docker)
        // Bạn cần lấy các giá trị projectId, privateKey, clientEmail từ file JSON và đưa vào .env
        return admin.initializeApp({
          credential: admin.credential.cert(firebaseConfig),
        });
        */
    },
};