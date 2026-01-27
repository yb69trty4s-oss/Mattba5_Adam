import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, priceUnits, priceUnitLabels, type PriceUnit } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

function ProductPriceCard({ 
  product, 
  onUpdate, 
  isPending 
}: { 
  product: Product; 
  onUpdate: (data: { id: number; price: number; priceUnit?: string; priceUnitAmount?: number }) => void;
  isPending: boolean;
}) {
  const [price, setPrice] = useState((product.price / 100).toString());
  const [unit, setUnit] = useState<PriceUnit>((product.priceUnit as PriceUnit) || "piece");
  const [amount, setAmount] = useState((product.priceUnitAmount || 1).toString());

  const handleSubmit = () => {
    const priceVal = parseFloat(price);
    const amountVal = parseFloat(amount);
    if (!isNaN(priceVal) && !isNaN(amountVal) && amountVal > 0) {
      onUpdate({ 
        id: product.id, 
        price: Math.round(priceVal * 100),
        priceUnit: unit,
        priceUnitAmount: amountVal
      });
    }
  };

  const formatUnitDisplay = () => {
    const unitLabel = priceUnitLabels[unit];
    const amountNum = parseFloat(amount) || 1;
    if (amountNum === 1) return unitLabel;
    if (amountNum === 0.5) return `نصف ${unitLabel}`;
    if (amountNum === 0.25) return `ربع ${unitLabel}`;
    return `${amountNum} ${unitLabel}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-muted-foreground whitespace-nowrap">السعر الحالي:</span>
          <span className="font-bold text-primary text-xl">
            {(product.price / 100).toFixed(2)} د.أ / {formatUnitDisplay()}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              step="0.01"
              placeholder="السعر"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              data-testid={`input-price-${product.id}`}
            />
            <span className="flex items-center text-muted-foreground">د.أ</span>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground whitespace-nowrap">لكل</span>
            <Input
              type="number"
              step="0.25"
              min="0.01"
              placeholder="الكمية"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-20"
              data-testid={`input-amount-${product.id}`}
            />
            <Select value={unit} onValueChange={(v) => setUnit(v as PriceUnit)}>
              <SelectTrigger className="w-28" data-testid={`select-unit-${product.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priceUnits.map((u) => (
                  <SelectItem key={u} value={u}>
                    {priceUnitLabels[u]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full"
            data-testid={`button-update-${product.id}`}
          >
            تحديث السعر
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated
  });

  const mutation = useMutation({
    mutationFn: async ({ id, price, priceUnit, priceUnitAmount }: { id: number; price: number; priceUnit?: string; priceUnitAmount?: number }) => {
      const res = await apiRequest("PATCH", `/api/products/${id}/price`, { price, priceUnit, priceUnitAmount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "تم التحديث",
        description: "تم تحديث السعر بنجاح",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل تحديث السعر",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "8890") {
      setIsAuthenticated(true);
    } else {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "كلمة المرور غير صحيحة",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col" dir="rtl">
        <Navigation />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-display flex items-center justify-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                لوحة التحكم السرية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-center text-xl tracking-widest"
                />
                <Button type="submit" className="w-full h-12 text-lg font-bold">
                  دخول
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-32">
        <h1 className="text-4xl font-display font-bold mb-8">إدارة الأسعار</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.map((product) => (
              <ProductPriceCard 
                key={product.id} 
                product={product} 
                onUpdate={(data) => mutation.mutate(data)}
                isPending={mutation.isPending}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
