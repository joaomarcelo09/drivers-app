import { InstructorWhereInput } from "../../generated/prisma/models"
import { getInstructorsRepository } from "../repositories/instructor.repository"

export const getInstructors = async (where: InstructorWhereInput) => {
   return await getInstructorsRepository(where)
}
