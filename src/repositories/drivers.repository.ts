import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../database/client";

export const createDriverRespository = async (userId: number, tx? : Prisma.TransactionClient) => {
  const prismaORM = tx || prisma
  return await prismaORM.driver.create({ data: { 
    active: true,  
    user: {
      connect: {
        id: userId
      }
    }
  } });
};
