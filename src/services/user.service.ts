import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";
import { createDriverRespository } from "../repositories/drivers.repository";
import { createInstructorRespository } from "../repositories/instructor.repository";
import { createUserRespository, getUserRepository, getMeUserRepository } from "../repositories/user.repository";
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
