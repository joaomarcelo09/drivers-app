import z from "zod";

export const instructorResponseSchema = z.object({
  priceHour: z.any(),
  bio: z.string(),
  user: z.object({
    name: z.string(),
    telephone: z.string(),
    city: z.string(),
    state: z.string(),
    email: z.string().email(),
  }),
});
