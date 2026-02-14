import { Prisma } from "../../generated/prisma/client";
import { InstructorWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";

export const createInstructorRespository = async (
  body: any,
  userId: number,
  tx?: Prisma.TransactionClient
) => {
  const prismaORM = tx || prisma;

  return await prismaORM.instructor.create({
    data: {
      active: true,
      priceHour: body.priceHour,
      latitude: body.coordinates.lat,
      longitude: body.coordinates.lng,
      bio: body.bio,
      instructorCategories: body.categoriesId?.length
        ? {
            createMany: {
              data: body.categoriesId.map((id: number) => ({
                categoryId: id,
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
  return await prisma.instructor.findMany({where});
};

export const getInstructorRepository = async (where: InstructorWhereInput) => {
  return await prisma.instructor.findFirst({where});
};
