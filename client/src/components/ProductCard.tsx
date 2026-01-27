import { motion } from "framer-motion";
import { type Product } from "@shared/schema";
import { ShoppingBag, Star, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, updateQuantity, items } = useCart();
  const { toast } = useToast();
  
  const cartItem = items.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "تم إضافة المنتج",
      description: `${product.name} تمت إضافته إلى السلة`,
      duration: 2000,
    });
  };

  const handleUpdateQuantity = (newQty: number) => {
    if (newQty <= 0) return;
    updateQuantity(product.id, newQty);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-2xl overflow-hidden border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.isPopular && (
          <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            <span>مشهور</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold font-display mb-2 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">السعر</span>
            <span className="text-lg font-bold text-primary">
              {(product.price / 100).toFixed(2)} د.أ
            </span>
          </div>
          
          {quantity > 0 ? (
            <div className="flex items-center gap-2 bg-muted rounded-full p-1 border border-border">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleUpdateQuantity(quantity - 1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={() => handleUpdateQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button 
              size="icon" 
              className="rounded-full shadow-md bg-primary hover:bg-primary/90"
              onClick={handleAddToCart}
              data-testid={`button-add-to-cart-${product.id}`}
            >
              <Plus className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
