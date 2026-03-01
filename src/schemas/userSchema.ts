import { z } from "zod";

const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string(),
  telephone: z.string(),
  password: z.string().min(8),
  gender: z.enum(["MALE", "FEMALE"]),
  city: z.string(),
  state: z.string(),
});

export const driverRegistrationSchema = userRegistrationSchema.extend({});

export const instructorRegistrationSchema = userRegistrationSchema.extend({
  categoriesId: z.array(z.number()),
  priceHour: z.number(),
  bio: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
});

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

export const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  telephone: z.string(),
  city: z.string(),
  state: z.string(),
  role: z.enum(["DRIVER", "INSTRUCTOR"]),
  gender: z.enum(["MALE", "FEMALE"]),
  driver: z
    .object({
      id: z.number(),
      active: z.boolean(),
    })
    .nullable(),
  instructor: z
    .object({
      id: z.number(),
      priceHour: z.any(),
      bio: z.string(),
      active: z.boolean(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
    })
    .nullable(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  telephone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  driver: z
    .object({
      active: z.boolean().optional(),
    })
    .optional(),
  instructor: z
    .object({
      priceHour: z.number().optional(),
      bio: z.string().optional(),
      active: z.boolean().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
});
