import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";
import { createDriverRespository } from "../repositories/drivers.repository";
import { createInstructorRespository } from "../repositories/instructor.repository";
import {
  createUserRespository,
  getUserRepository,
  getMeUserRepository,
  updateUserRepository,
  updateRefreshTokenRepository,
  getUserByIdWithRefreshTokenRepository,
  confirmUserEmailRepository,
  getUserByConfirmationTokenRepository,
  setPasswordResetTokenRepository,
  getUserByPasswordResetTokenRepository,
  clearPasswordResetTokenRepository,
  updatePasswordRepository,
} from "../repositories/user.repository";
import { UserRegisterInput } from "../types/registerInput";
import { randomBytes } from "crypto";
import { sendConfirmationEmail, sendPasswordResetEmail } from "../utils/email";
import { hashPassword } from "../utils/bcrypt";

const normalizeInstructorRelations = (user: any) => {
  if (!user?.instructor) {
    return user;
  }

  const { instructorCategories, instructorVehicles, ...instructorData } = user.instructor;

  const vehicleCategories = instructorVehicles?.map((iv: any) => iv.vehicleType?.id) || [];

  user.instructor = {
    ...instructorData,
    teachingCategories: instructorCategories?.map((ic: any) => ic.licenseCategory?.id) || [],
    vehicleCategories,
    hasVehicle: vehicleCategories.length > 0,
  };

  return user;
};

export const createUser = async (body: UserRegisterInput) => {
  const confirmationToken = randomBytes(32).toString("hex");

  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await createUserRespository({ ...body, confirmationToken }, tx);

    if (body.role === "INSTRUCTOR") {
      await createInstructorRespository(body, user.id, tx);
    }

    if (body.role === "DRIVER") {
      await createDriverRespository(user.id, tx);
    }

    return user;
  });

  return createdUser;
};

export const getUser = async (where: UserWhereInput) => {
  return await getUserRepository(where);
};

export const getMeUser = async (userId: number) => {
  const user = await getMeUserRepository(userId);

  return normalizeInstructorRelations(user);
};

export const updateUser = async (
  userId: number,
  userData: {
    name?: string;
    telephone?: string;
    city?: string;
    state?: string;
    gender?: "MALE" | "FEMALE";
    photo?: string;
  },
  driverData?: {
    active?: boolean;
  },
  instructorData?: {
    priceHour?: number;
    bio?: string;
    cnh?: string;
    active?: boolean;
    latitude?: number;
    longitude?: number;
    vehicleCategories?: number[];
    teachingCategories?: number[];
    rating?: number;
    rangeKm?: number;
  },
) => {
  const user = await updateUserRepository(userId, userData, driverData, instructorData);

  return normalizeInstructorRelations(user);
};

export const updateRefreshToken = async (userId: number, refreshToken: string) => {
  return await updateRefreshTokenRepository(userId, refreshToken);
};

export const getUserByIdWithRefreshToken = async (userId: number) => {
  return await getUserByIdWithRefreshTokenRepository(userId);
};

export const confirmUserEmail = async (confirmationToken: string) => {
  const user = await getUserByConfirmationTokenRepository(confirmationToken);

  if (!user) {
    return null;
  }

  return await confirmUserEmailRepository(confirmationToken);
};

export const getUserByConfirmationToken = async (confirmationToken: string) => {
  return await getUserByConfirmationTokenRepository(confirmationToken);
};

export const requestPasswordReset = async (email: string) => {
  const user = await getUserRepository({ email });

  // Always resolve successfully to prevent user enumeration
  if (!user || !user.isConfirmed) {
    return;
  }

  const resetToken = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await setPasswordResetTokenRepository(user.id, resetToken, expires);
  await sendPasswordResetEmail(user.email, user.name, resetToken);
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await getUserByPasswordResetTokenRepository(token);

  if (!user) {
    return null;
  }

  const hashed = await hashPassword(newPassword);
  await updatePasswordRepository(user.id, hashed);
  await clearPasswordResetTokenRepository(user.id);

  return user;
};
