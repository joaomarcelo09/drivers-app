import { prisma } from "../database/client";


export const createUserRespository = async () => {
  return prisma.user.create({ data: { name: "John Doe", email: "j@j.com" } });
};
