import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated
  });

  const mutation = useMutation({
    mutationFn: async ({ id, price }: { id: number; price: number }) => {
      const res = await apiRequest("PATCH", `/api/products/${id}/price`, { price });
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
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground whitespace-nowrap">السعر الحالي:</span>
                    <span className="font-bold text-primary text-xl">${(product.price / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="السعر الجديد"
                      onBlur={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          mutation.mutate({ id: product.id, price: Math.round(val * 100) });
                        }
                      }}
                    />
                    <Button 
                      disabled={mutation.isPending}
                      className="whitespace-nowrap"
                    >
                      تحديث
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
