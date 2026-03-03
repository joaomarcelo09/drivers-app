import z from "zod";

export const instructorResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  telephone: z.string(),
  cnh: z.string(),
  hasVehicle: z.boolean(),
  photo: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  distance: z.number(),
  pricePerHour: z.any(),
  vehicleType: z.string(),
  categories: z.array(z.string()),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  bio: z.string().optional(),
});
