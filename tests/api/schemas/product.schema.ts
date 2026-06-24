import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number().positive(),
  title: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  category: z.string().min(1),
  thumbnail: z.url(),
  images: z.array(z.url()).optional(),
});

export const ProductListSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
});

export type Product = z.infer<typeof ProductSchema>;
