import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});
