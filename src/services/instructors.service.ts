import { InstructorWhereInput } from "../../generated/prisma/models"
import { getInstructorRepository, getInstructorsRepository } from "../repositories/instructor.repository"

export const getInstructors = async (where: InstructorWhereInput) => {
   return await getInstructorsRepository(where)
}

export const getInstructor = async (where: InstructorWhereInput) => {
   return await getInstructorRepository(where)
}
