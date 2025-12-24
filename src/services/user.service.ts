import { createUserRespository } from "../repositories/user.repository"

export const createUser = async () => {
   return await createUserRespository()
}
