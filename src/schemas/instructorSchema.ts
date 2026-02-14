import z from "zod";

export const instructorResponseSchema = z.object({
  id: z.number(),
  priceHour: z.any(),
  bio: z.string(),
  active: z.boolean(),
})
