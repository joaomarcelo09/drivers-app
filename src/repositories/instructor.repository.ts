import { Prisma } from "../../generated/prisma/client";
import { InstructorWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";

export const createInstructorRespository = async (body: any, userId: number, tx?: Prisma.TransactionClient) => {
  const prismaORM = tx || prisma;

  return await prismaORM.instructor.create({
    data: {
      active: true,
      priceHour: body.priceHour,
      cnh: body.cnh,
      hasVehicle: body.hasVehicle,
      rating: body.rating,
      latitude: body.coordinates.lat,
      longitude: body.coordinates.lng,
      bio: body.bio,
      rangeKm: body.rangeKm || 0,
      instructorCategories: body.categoriesId?.length
        ? {
            createMany: {
              data: body.categoriesId.map((id: number) => ({
                categoryId: id,
              })),
            },
          }
        : undefined,
      instructorVehicles: body.vehicleTypesId?.length
        ? {
            createMany: {
              data: body.vehicleTypesId.map((id: number) => ({
                vehicleTypeId: id,
              })),
            },
          }
        : undefined,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

export const getInstructorsRepository = async (where: InstructorWhereInput) => {
  return await prisma.instructor.findMany({
    where,
    select: {
      id: true,
      priceHour: true,
      bio: true,
      cnh: true,
      hasVehicle: true,
      rating: true,
      active: true,
      latitude: true,
      longitude: true,
      rangeKm: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          telephone: true,
          gender: true,
          city: true,
          photo: true,
          state: true,
        },
      },
      instructorCategories: {
        select: {
          licenseCategory: {
            select: {
              acronym: true,
            },
          },
        },
      },
      instructorVehicles: {
        select: {
          vehicleType: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

export const getInstructorRepository = async (where: InstructorWhereInput) => {
  return await prisma.instructor.findFirst({
    where,
    select: {
      id: true,
      priceHour: true,
      bio: true,
      cnh: true,
      hasVehicle: true,
      rating: true,
      active: true,
      latitude: true,
      longitude: true,
      rangeKm: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          telephone: true,
          gender: true,
          photo: true,
          city: true,
          state: true,
        },
      },
      instructorCategories: {
        select: {
          licenseCategory: {
            select: {
              acronym: true,
            },
          },
        },
      },
      instructorVehicles: {
        select: {
          vehicleType: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};
