import { Prisma } from "../../generated/prisma/client";
import { UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";
import { UserRegisterInput } from "../types/registerInput";

export const createUserRespository = async (body: UserRegisterInput, tx?: Prisma.TransactionClient) => {
  const prismaORM = tx || prisma
  return await prismaORM.user.create({ data: { 
    name: body.name, 
    email: body.email, 
    password: body.password, 
    telephone: body.telephone,
    role: body.role,
    gender: body.gender,
    city: body.city,
    state: body.state
  } });
};

export const getUserRepository = async (where: UserWhereInput) => {
  return await prisma.user.findFirst({ where });
}
