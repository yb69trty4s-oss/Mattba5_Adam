import { db } from "./db";
import {
  categories,
  products,
  deliveryZones,
  type Category,
  type Product,
  type DeliveryZone,
  type InsertDeliveryZone,
  type InsertProduct,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getProducts(categoryId?: number, isPopular?: boolean): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  updateProductPrice(id: number, price: number, priceUnit?: string, priceUnitAmount?: number): Promise<Product | undefined>;
  
  // Product CRUD
  createProduct(data: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Delivery Zones
  getDeliveryZones(): Promise<DeliveryZone[]>;
  createDeliveryZone(data: InsertDeliveryZone): Promise<DeliveryZone>;
  updateDeliveryZone(id: number, data: Partial<InsertDeliveryZone>): Promise<DeliveryZone | undefined>;
  deleteDeliveryZone(id: number): Promise<boolean>;
  
  // Seeding methods
  seedCategories(data: any[]): Promise<void>;
  seedProducts(data: any[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getProducts(categoryId?: number, isPopular?: boolean): Promise<Product[]> {
    let query = db.select().from(products);
    
    if (categoryId) {
      // @ts-ignore - complex query building type issue
      query = query.where(eq(products.categoryId, categoryId));
    }
    
    if (isPopular) {
      // @ts-ignore
      query = query.where(eq(products.isPopular, true));
    }
    
    return await query;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async updateProductPrice(id: number, price: number, priceUnit?: string, priceUnitAmount?: number): Promise<Product | undefined> {
    const updateData: any = { price };
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit;
    if (priceUnitAmount !== undefined) updateData.priceUnitAmount = priceUnitAmount;
    
    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async createProduct(data: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(data).returning();
    return product;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set(data)
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  async getDeliveryZones(): Promise<DeliveryZone[]> {
    return await db.select().from(deliveryZones);
  }

  async createDeliveryZone(data: InsertDeliveryZone): Promise<DeliveryZone> {
    const [zone] = await db.insert(deliveryZones).values(data).returning();
    return zone;
  }

  async updateDeliveryZone(id: number, data: Partial<InsertDeliveryZone>): Promise<DeliveryZone | undefined> {
    const [updated] = await db
      .update(deliveryZones)
      .set(data)
      .where(eq(deliveryZones.id, id))
      .returning();
    return updated;
  }

  async deleteDeliveryZone(id: number): Promise<boolean> {
    const result = await db.delete(deliveryZones).where(eq(deliveryZones.id, id)).returning();
    return result.length > 0;
  }

  async seedCategories(data: any[]): Promise<void> {
    if ((await this.getCategories()).length === 0) {
      await db.insert(categories).values(data);
    }
  }

  async seedProducts(data: any[]): Promise<void> {
    if ((await this.getProducts()).length === 0) {
      await db.insert(products).values(data);
    }
  }
}

export const storage = new DatabaseStorage();
