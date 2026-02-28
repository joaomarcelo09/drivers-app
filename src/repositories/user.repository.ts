import { Prisma } from "../../generated/prisma/client";
import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";
import { UserRegisterInput } from "../types/registerInput";

export const createUserRespository = async (body: UserRegisterInput, tx?: Prisma.TransactionClient) => {
  const prismaORM = tx || prisma;

  return await prismaORM.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      telephone: body.telephone,
      role: body.role,
      gender: body.gender,
      city: body.city,
      state: body.state,
    },
  });
};

export const getUserRepository = async (where: UserWhereInput) => {
  return await prisma.user.findFirst({ where });
};

export const getMeUserRepository = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      telephone: true,
      city: true,
      state: true,
      role: true,
      gender: true,
      driver: {
        select: {
          id: true,
          active: true,
        },
      },
      instructor: {
        select: {
          id: true,
          priceHour: true,
          bio: true,
          active: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  });

  return user;
};
