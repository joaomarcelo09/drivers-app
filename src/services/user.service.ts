import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";
import { createDriverRespository } from "../repositories/drivers.repository";
import { createInstructorRespository } from "../repositories/instructor.repository";
import { createUserRespository, getUserRepository, getMeUserRepository, updateUserRepository } from "../repositories/user.repository";
import { UserRegisterInput } from "../types/registerInput";

export const createUser = async (body: UserRegisterInput) => {
  const createdUser = await prisma.$transaction(async (tx) => {
    const user = await createUserRespository(body, tx);

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
  return await getMeUserRepository(userId);
};

export const updateUser = async (
  userId: number,
  userData: {
    name?: string;
    telephone?: string;
    city?: string;
    state?: string;
    gender?: "MALE" | "FEMALE";
  },
  driverData?: {
    active?: boolean;
  },
  instructorData?: {
    priceHour?: number;
    bio?: string;
    active?: boolean;
    latitude?: number;
    longitude?: number;
  },
) => {
  return await updateUserRepository(userId, userData, driverData, instructorData);
};
