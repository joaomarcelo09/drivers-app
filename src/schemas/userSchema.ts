import { z } from 'zod';

const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(8),
  role: z.enum(['DRIVER', 'INSTRUCTOR']),
  gender: z.enum(['MALE', 'FEMALE']),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  city: z.string(),
  state: z.string(),
});

export const driverRegistrationSchema = userRegistrationSchema.extend({
  targetCategoryId: z.number(),
})

export const instructorRegistrationSchema = userRegistrationSchema.extend({
  categoriesId: z.array(z.number()),
  priceHour: z.number(),
  bio: z.string(),
})

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});

export const userAuthResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  accessToken: z.string(),
});
