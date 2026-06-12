import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(1),
  email: z.email(),
  phone: z.string(),
  age: z.number().int().positive(),
  gender: z.enum(["male", "female"]),
  role: z.enum(["admin", "moderator", "user"]),
});

export const UserListSchema = z.object({
  users: z.array(UserSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});

export type Product = z.infer<typeof UserSchema>;
