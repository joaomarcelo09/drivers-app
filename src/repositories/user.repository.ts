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

export const updateUserRepository = async (
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updateData: Prisma.UserUpdateInput = {
    ...(userData.name && { name: userData.name }),
    ...(userData.telephone && { telephone: userData.telephone }),
    ...(userData.city && { city: userData.city }),
    ...(userData.state && { state: userData.state }),
    ...(userData.gender && { gender: userData.gender }),
  };

  if (user.role === "DRIVER" && driverData) {
    updateData.driver = {
      update: {
        ...(driverData.active !== undefined && { active: driverData.active }),
      },
    };
  }

  if (user.role === "INSTRUCTOR" && instructorData) {
    updateData.instructor = {
      update: {
        ...(instructorData.priceHour !== undefined && { priceHour: instructorData.priceHour }),
        ...(instructorData.bio !== undefined && { bio: instructorData.bio }),
        ...(instructorData.active !== undefined && { active: instructorData.active }),
        ...(instructorData.latitude !== undefined && { latitude: instructorData.latitude }),
        ...(instructorData.longitude !== undefined && { longitude: instructorData.longitude }),
      },
    };
  }

  return await prisma.user.update({
    where: { id: userId },
    data: updateData,
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
};
