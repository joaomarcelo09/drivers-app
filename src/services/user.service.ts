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
} from "../repositories/user.repository";
import { UserRegisterInput } from "../types/registerInput";
import { randomBytes } from "crypto";

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

  if (user?.instructor) {
    const { instructorVehicles, ...instructorData } = user.instructor;
    (user as any).instructor = {
      ...instructorData,
      vehicleType: instructorVehicles?.map((iv: any) => iv.vehicleType?.id) || [],
    };
  }

  return user;
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
    hasVehicle?: boolean;
    vehicleType?: number[];
    rating?: number;
    rangeKm?: number;
  },
) => {
  return await updateUserRepository(userId, userData, driverData, instructorData);
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
