import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Arabic name
  slug: text("slug").notNull().unique(),
  image: text("image").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => categories.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Stored in cents/smallest currency unit
  image: text("image").notNull(),
  isPopular: boolean("is_popular").default(false),
});

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true });

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;

// Admin Schemas
export const updatePriceSchema = z.object({
  price: z.number().min(0),
});
