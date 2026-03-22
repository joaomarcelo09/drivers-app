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
      photo: body.photo,
      gender: body.gender,
      city: body.city,
      state: body.state,
      confirmationToken: body.confirmationToken,
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
      photo: true,
      isConfirmed: true,
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
          cnh: true,
          active: true,
          latitude: true,
          longitude: true,
          rangeKm: true,
          hasVehicle: true,
          instructorVehicles: {
            select: {
              vehicleType: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
          rating: true,
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
    photo?: string;
  },
  driverData?: {
    active?: boolean;
  },
  instructorData?: {
    priceHour?: number;
    bio?: string;
    cnh?: string;
    photo?: string;
    active?: boolean;
    latitude?: number;
    longitude?: number;
    hasVehicle?: boolean;
    vehicleType?: number[];
    rating?: number;
    rangeKm?: number;
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
    ...(userData.photo && { photo: userData.photo }),
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
        ...(instructorData.cnh !== undefined && { cnh: instructorData.cnh }),
        ...(instructorData.active !== undefined && { active: instructorData.active }),
        ...(instructorData.latitude !== undefined && { latitude: instructorData.latitude }),
        ...(instructorData.longitude !== undefined && { longitude: instructorData.longitude }),
        ...(instructorData.vehicleType !== undefined && { vehicleType: instructorData.vehicleType }),
        ...(instructorData.rating !== undefined && { rating: instructorData.rating }),
        ...(instructorData.rangeKm !== undefined && { rangeKm: instructorData.rangeKm }),
        ...(instructorData.hasVehicle !== undefined && { hasVehicle: instructorData.hasVehicle }),
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
      photo: true,
      isConfirmed: true,
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
          cnh: true,
          active: true,
          latitude: true,
          longitude: true,
          rating: true,
          rangeKm: true,
          hasVehicle: true,
          instructorVehicles: {
            select: {
              vehicleType: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const updateRefreshTokenRepository = async (userId: number, refreshToken: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });
};

export const getUserByIdWithRefreshTokenRepository = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      refreshToken: true,
    },
  });
};

export const updateConfirmationTokenRepository = async (userId: number, confirmationToken: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { confirmationToken },
  });
};

export const confirmUserEmailRepository = async (confirmationToken: string) => {
  return await prisma.user.updateMany({
    where: { confirmationToken },
    data: {
      confirmationToken: null,
      isConfirmed: true,
    },
  });
};

export const getUserByConfirmationTokenRepository = async (confirmationToken: string) => {
  return await prisma.user.findFirst({
    where: { confirmationToken },
  });
};
