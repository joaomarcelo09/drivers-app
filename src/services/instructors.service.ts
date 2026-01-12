import { getInstructorsRepository } from "../repositories/instructor.repository"

export const getInstructors = async (where: any) => {
   return await getInstructorsRepository(where)
}
