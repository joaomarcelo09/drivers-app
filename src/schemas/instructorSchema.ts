import z from "zod";

export const instructorResponseSchema = z.object({
  id: z.number(),
  createdAt: z.date(),
  name: z.string(),
  email: z.string().email(),
  telephone: z.string(),
  city: z.string(),
  state: z.string(),
  cnh: z.string(),
  hasVehicle: z.boolean(),
  photo: z.string(),
  rating: z.number(),
  reviewCount: z.number(),
  rangeKm: z.number(),
  distance: z.number(),
  pricePerHour: z.any(),
  vehicleTypes: z.array(z.string()),
  categories: z.array(z.string()),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  bio: z.string().optional(),
});
