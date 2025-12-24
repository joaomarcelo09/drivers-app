import { createUserRespository, getUserRepository } from "../repositories/user.repository"
import { RegisterInput } from "../types/registerInput"

export const createUser = async (body: RegisterInput) => {

   return await createUserRespository(body)
}

export const getUser = async (where) => {
   return await getUserRepository(where)
}
