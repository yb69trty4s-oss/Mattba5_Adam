import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import path from "path";
import express from "express";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use("/attached_assets", express.static(path.resolve(process.cwd(), "attached_assets")));
  app.use("/images", express.static(path.resolve(process.cwd(), "attached_assets/generated_images")));

  // === API Routes ===

  app.get(api.categories.list.path, async (_req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.categories.get.path, async (req, res) => {
    const category = await storage.getCategory(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  });

  app.get("/api/products", async (req, res) => {
    // Manually parse query params since Express doesn't auto-coerce types exactly like Zod wants sometimes
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const isPopular = req.query.isPopular === 'true';
    
    const products = await storage.getProducts(categoryId, isPopular);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  });

  app.patch("/api/products/:id/price", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { price } = req.body;
      
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: "Invalid price" });
      }

      const updated = await storage.updateProductPrice(id, price);
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // === Seeding ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  console.log("Seeding database...");
  
  // Arabic Data Seeding
  await storage.seedCategories([
    { name: "مقبلات", slug: "appetizers", image: "/images/hero1.png" },
    { name: "أطباق رئيسية", slug: "main-dishes", image: "/images/hero2.png" },
    { name: "حلويات", slug: "desserts", image: "/images/hero1.png" },
  ]);

  // Get categories to link products
  const categories = await storage.getCategories();
  const catMap = new Map(categories.map(c => [c.slug, c.id]));

  if (catMap.size > 0) {
    await storage.seedProducts([
      // Appetizers
      { 
        categoryId: catMap.get("appetizers"), 
        name: "كبة مقلية", 
        description: "كبة محشوة باللحم والصنوبر مقلية ومقرمشة", 
        price: 500, // 5.00
        image: "/images/fried_kibbeh_balls_with_meat_filling.png",
        isPopular: true
      },
      { 
        categoryId: catMap.get("appetizers"), 
        name: "رقايق جبنة", 
        description: "رقايق مقرمشة محشوة بالجبنة", 
        price: 450, 
        image: "/images/cheese_rolls_rakayek_jibneh_plate.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("appetizers"), 
        name: "رقايق جبنة و سجق", 
        description: "رقايق مقرمشة محشوة بالجبنة والسجق", 
        price: 500, 
        image: "/images/cheese_and_sujuk_rolls_appetizer_platter.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("appetizers"), 
        name: "سمبوسك لحمة", 
        description: "سمبوسك محشوة باللحم", 
        price: 550, 
        image: "/images/meat_sambousek_pastries_on_wooden_board.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("appetizers"), 
        name: "سمبوسك جبنة", 
        description: "سمبوسك محشوة بالجبنة", 
        price: 450, 
        image: "/images/cheese_sambousek_pastries_with_nigella_seeds.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("appetizers"), 
        name: "ورق عنب بزيت", 
        description: "ورق عنب بالزيت والليمون", 
        price: 1000, 
        image: "/images/grape_leaves_bi_zeit_with_pomegranate_seeds.png", 
        isPopular: true
      },
      // Main Dishes
      { 
        categoryId: catMap.get("main-dishes"), 
        name: "كبة مشوية", 
        description: "كبة مشوية على الفحم بنكهة الشواء الأصيلة", 
        price: 750, 
        image: "/images/grilled_kibbeh_disc_with_charcoal_marks.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("main-dishes"), 
        name: "ششبرك لحمة", 
        description: "ششبرك باللحم واللبن", 
        price: 500, 
        image: "/images/shishbarak_dumplings_in_warm_yogurt_sauce.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("main-dishes"), 
        name: "ورق عنب بلحمة", 
        description: "ورق عنب مطهو مع اللحم", 
        price: 1300, 
        image: "/images/grape_leaves_warak_enab_with_meat_chunks.png", 
        isPopular: true
      },
      { 
        categoryId: catMap.get("main-dishes"), 
        name: "كبة قراص", 
        description: "أقراص كبة مميزة", 
        price: 500, 
        image: "/images/traditional_kibbeh_qrass_patties_with_nuts.png", 
        isPopular: true
      },
    ]);
  }
  
  console.log("Database seeded successfully.");
}
