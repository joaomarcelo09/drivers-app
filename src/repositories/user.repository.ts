import { UserCreateInput, UserWhereInput } from "../../generated/prisma/models";
import { prisma } from "../database/client";


export const createUserRespository = async (body: UserCreateInput) => {
  return await prisma.user.create({ data: { 
    name: body.name, 
    email: body.email, 
    password: body.password, 
    role: body.role,
    gender: body.gender,
    coordinates: body.coordinates,
    city: body.city,
    state: body.state
  } });
};

export const getUserRepository = async (where: UserWhereInput) => {
  return await prisma.user.findFirst({ where });
}
