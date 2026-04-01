import admin from "firebase-admin";
import { randomUUID } from "crypto";
import { extname } from "path";
import HttpException from "../models/http-exception.model";
import { StatusCodes } from "http-status-codes";

const getFirebaseApp = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  if (!projectId || !clientEmail || !privateKey || !storageBucket) {
    throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, {
      error: "Firebase Storage não está configurado corretamente",
    });
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
  });
};

const sanitizeFileName = (value: string) => value.toLowerCase().replace(/[^a-z0-9.-]/g, "-");

export const uploadUserPhoto = async (file: Express.Multer.File, userEmail: string) => {
  const app = getFirebaseApp();
  const bucket = app.storage().bucket();
  const extension = extname(file.originalname) || ".jpg";
  const token = randomUUID();
  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const filePath = `users/${sanitizeFileName(userEmail)}/${fileName}`;

  const storageFile = bucket.file(filePath);

  await storageFile.save(file.buffer, {
    resumable: false,
    metadata: {
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filePath)}?alt=media&token=${token}`;
};
