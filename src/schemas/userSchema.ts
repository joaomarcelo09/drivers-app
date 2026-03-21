import { z } from "zod";

const userRegistrationSchema = z.object({
  name: z.string(),
  email: z.string(),
  telephone: z.string(),
  password: z.string().min(8),
  gender: z.enum(["MALE", "FEMALE"]),
  photo: z.string().optional(),
  city: z.string(),
  state: z.string(),
});

export const driverRegistrationSchema = userRegistrationSchema.extend({});

export const instructorRegistrationSchema = userRegistrationSchema.extend({
  categoriesId: z.array(z.number()),
  priceHour: z.number(),
  hasVehicle: z.boolean(),
  vehicleType: z.array(z.number()),
  cnh: z.string(),
  bio: z.string(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }),
  photo: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
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
  photo: z.string(),
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
      cnh: z.string(),
      active: z.boolean(),
      rangeKm: z.number(),
      latitude: z.number().nullable(),
      longitude: z.number().nullable(),
      hasVehicle: z.boolean(),
      vehicleType: z.string(),
      rating: z.number(),
    })
    .nullable(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  telephone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  photo: z.string().optional(),
  driver: z
    .object({
      active: z.boolean().optional(),
    })
    .optional(),
  instructor: z
    .object({
      priceHour: z.number().optional(),
      bio: z.string().optional(),
      cnh: z.string().optional(),
      active: z.boolean().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      hasVehicle: z.boolean().optional(),
      vehicleType: z.string().optional(),
      rating: z.number().optional(),
      rangeKm: z.number().optional(),
    })
    .optional(),
});
