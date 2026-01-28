import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import path from "path";
import express from "express";
import { imagekit } from "./imagekit";

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
      const { price, priceUnit, priceUnitAmount } = req.body;
      
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: "Invalid price" });
      }

      const updated = await storage.updateProductPrice(id, price, priceUnit, priceUnitAmount);
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // === Delivery Zones ===
  app.get("/api/delivery-zones", async (_req, res) => {
    const zones = await storage.getDeliveryZones();
    res.json(zones);
  });

  app.post("/api/delivery-zones", async (req, res) => {
    try {
      const { name, price } = req.body;
      if (!name || typeof price !== 'number') {
        return res.status(400).json({ message: "Invalid data" });
      }
      const zone = await storage.createDeliveryZone({ name, price });
      res.json(zone);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/delivery-zones/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, price } = req.body;
      const updateData: any = {};
      if (name) updateData.name = name;
      if (typeof price === 'number') updateData.price = price;
      
      const updated = await storage.updateDeliveryZone(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/delivery-zones/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteDeliveryZone(id);
      if (!deleted) {
        return res.status(404).json({ message: "Zone not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // === ImageKit Auth ===
  app.get("/api/imagekit/auth", async (_req, res) => {
    try {
      const authParams = imagekit.getAuthenticationParameters();
      res.json(authParams);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate auth params" });
    }
  });

  // === Product CRUD ===
  app.post("/api/products", async (req, res) => {
    try {
      const { name, description, categoryId, price, priceUnit, priceUnitAmount, image, isPopular } = req.body;
      
      if (!name || !description || typeof price !== 'number' || !image) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const product = await storage.createProduct({
        name,
        description,
        categoryId: categoryId || null,
        price,
        priceUnit: priceUnit || "piece",
        priceUnitAmount: priceUnitAmount || 1,
        image,
        isPopular: isPopular || false
      });
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, description, categoryId, price, priceUnit, priceUnitAmount, image, isPopular } = req.body;
      
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (price !== undefined) updateData.price = price;
      if (priceUnit !== undefined) updateData.priceUnit = priceUnit;
      if (priceUnitAmount !== undefined) updateData.priceUnitAmount = priceUnitAmount;
      if (image !== undefined) updateData.image = image;
      if (isPopular !== undefined) updateData.isPopular = isPopular;
      
      const updated = await storage.updateProduct(id, updateData);
      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Seeding disabled as per user request
  return httpServer;
}

async function seedDatabase() {
  // Seeding disabled or silenced as per user request
  return;
}
