import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/menu", label: "القائمة" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const { items, itemCount, total, updateQuantity, removeItem, clearCart } = useCart();
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOrder = () => {
    if (items.length === 0) return;
    
    setIsOrdering(true);
    
    // Success animation
    setTimeout(() => {
      setIsOrdering(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        const phoneNumber = "96181984634";
        const orderText = items
          .map((item) => `• ${item.name} (${item.quantity}x) - $${((item.price * item.quantity) / 100).toFixed(2)}`)
          .join("\n");
        
        const message = encodeURIComponent(
          `*طلب جديد من مطبخ آدم*\n\n` +
          `*الطلبات:*\n${orderText}\n\n` +
          `*المجموع الإجمالي: $${(total / 100).toFixed(2)}*\n\n` +
          `يرجى تأكيد الطلب وتزويدي بالوقت المتوقع للتوصيل.`
        );
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
        setShowSuccess(false);
        clearCart();
      }, 2000);
    }, 1500);
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-lg group-hover:scale-105 transition-transform duration-300 border-2 border-primary/20">
                <img 
                  src="/attached_assets/67b44034-7853-4948-8a1a-55382670af9a_1769435846205.jpeg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`font-display text-2xl font-bold transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}>
                مطبخ آدم
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`relative font-medium text-lg cursor-pointer transition-colors duration-200 hover:text-primary ${
                    scrolled 
                      ? (location === link.href ? "text-primary" : "text-foreground") 
                      : (location === link.href ? "text-primary" : "text-white/90 hover:text-white")
                  }`}
                >
                  {link.label}
                  {location === link.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute -bottom-1 right-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </span>
              </Link>
            ))}
            
            {/* Cart Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative rounded-full hover-elevate ${scrolled ? "text-foreground" : "text-white hover:bg-white/10"}`}
                  data-testid="button-cart-desktop"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-background animate-in zoom-in"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col" dir="rtl">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-2xl font-bold font-display flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    سلة المشتريات
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">السلة فارغة</h3>
                        <p className="text-muted-foreground">ابدأ بإضافة بعض المأكولات الشهية من القائمة</p>
                      </div>
                      <Link href="/menu">
                        <Button className="rounded-full px-8">تصفح القائمة</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <h4 className="font-bold text-lg line-clamp-1">{item.name}</h4>
                              <p className="text-primary font-bold">${(item.price / 100).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {items.length > 0 && (
                  <SheetFooter className="p-6 border-t bg-muted/30">
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>المجموع الإجمالي</span>
                        <span className="text-primary text-2xl">${(total / 100).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <Button 
                        className="w-full h-14 rounded-xl text-xl font-bold shadow-lg relative overflow-hidden group"
                        onClick={handleOrder}
                        disabled={isOrdering || showSuccess}
                      >
                        {isOrdering ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            جاري تجهيز الطلب...
                          </span>
                        ) : showSuccess ? (
                          <motion.span 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-green-500"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                            تم الطلب بنجاح!
                          </motion.span>
                        ) : (
                          "إتمام الطلب عبر WhatsApp"
                        )}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        سيتم توجيهك إلى واتساب لإرسال تفاصيل الطلب
                      </p>
                    </div>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            <Link href="/contact">
              <Button 
                variant={scrolled ? "default" : "secondary"}
                className={`rounded-full px-6 font-bold shadow-lg ${!scrolled && "bg-white text-primary hover:bg-white/90"}`}
              >
                اتصل بنا
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`relative rounded-full ${scrolled ? "text-foreground" : "text-white hover:bg-white/10"}`}
                  data-testid="button-cart-mobile"
                >
                  <ShoppingBag className="w-6 h-6" />
                  {itemCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full border-2 border-background animate-in zoom-in"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 flex flex-col" dir="rtl">
                 <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-2xl font-bold font-display flex items-center gap-2 text-right">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                    سلة المشتريات
                  </SheetTitle>
                </SheetHeader>
                
                <ScrollArea className="flex-1 p-6">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">السلة فارغة</h3>
                        <p className="text-muted-foreground">ابدأ بإضافة بعض المأكولات الشهية من القائمة</p>
                      </div>
                      <Link href="/menu">
                        <Button className="rounded-full px-8" onClick={() => setIsOpen(false)}>تصفح القائمة</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-1 text-right">
                            <div>
                              <h4 className="font-bold text-lg line-clamp-1">{item.name}</h4>
                              <p className="text-primary font-bold">${(item.price / 100).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-md"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {items.length > 0 && (
                  <SheetFooter className="p-6 border-t bg-muted/30">
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span>المجموع الإجمالي</span>
                        <span className="text-primary text-2xl">${(total / 100).toFixed(2)}</span>
                      </div>
                      <Separator />
                      <Button 
                        className="w-full h-14 rounded-xl text-xl font-bold shadow-lg relative overflow-hidden"
                        onClick={handleOrder}
                        disabled={isOrdering || showSuccess}
                      >
                        {isOrdering ? (
                          <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            جاري تجهيز الطلب...
                          </span>
                        ) : showSuccess ? (
                          <motion.span 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2 text-green-500"
                          >
                            <CheckCircle2 className="w-6 h-6" />
                            تم الطلب بنجاح!
                          </motion.span>
                        ) : (
                          "إتمام الطلب عبر WhatsApp"
                        )}
                      </Button>
                    </div>
                  </SheetFooter>
                )}
              </SheetContent>
            </Sheet>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/10"}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="container px-4 py-6 space-y-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div 
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-lg font-medium transition-colors cursor-pointer ${
                      location === link.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </div>
                </Link>
              ))}
              <Link href="/contact">
                 <div onClick={() => setIsOpen(false)}>
                  <Button className="w-full mt-4 rounded-xl py-6 text-lg font-bold">
                    اتصل بنا
                  </Button>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
