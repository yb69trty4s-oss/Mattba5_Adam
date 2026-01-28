import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, priceUnits, priceUnitLabels, type PriceUnit, type DeliveryZone, type Category } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Trash2, Plus, MapPin, Upload, Package, Image as ImageIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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

function DeliveryZoneCard({
  zone,
  onUpdate,
  onDelete,
  isPending
}: {
  zone: DeliveryZone;
  onUpdate: (data: { id: number; name?: string; price?: number }) => void;
  onDelete: (id: number) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(zone.name);
  const [price, setPrice] = useState((zone.price / 100).toString());

  const handleUpdate = () => {
    const priceVal = parseFloat(price);
    if (name.trim() && !isNaN(priceVal) && priceVal >= 0) {
      onUpdate({ id: zone.id, name: name.trim(), price: Math.round(priceVal * 100) });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اسم المنطقة"
          data-testid={`input-zone-name-${zone.id}`}
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex-1"
            data-testid={`input-zone-price-${zone.id}`}
          />
          <span className="text-muted-foreground">د.أ</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleUpdate}
            disabled={isPending}
            className="flex-1"
            data-testid={`button-update-zone-${zone.id}`}
          >
            تحديث
          </Button>
          <Button 
            variant="destructive"
            size="icon"
            onClick={() => onDelete(zone.id)}
            disabled={isPending}
            data-testid={`button-delete-zone-${zone.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZonePrice, setNewZonePrice] = useState("");
  
  const [newProductName, setNewProductName] = useState("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductUnit, setNewProductUnit] = useState<PriceUnit>("piece");
  const [newProductAmount, setNewProductAmount] = useState("1");
  const [newProductCategory, setNewProductCategory] = useState<string>("");
  const [newProductIsPopular, setNewProductIsPopular] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProductImage, setNewProductImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated
  });

  const { data: deliveryZones, isLoading: isLoadingZones } = useQuery<DeliveryZone[]>({
    queryKey: ["/api/delivery-zones"],
    enabled: isAuthenticated
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
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

  const createZoneMutation = useMutation({
    mutationFn: async ({ name, price }: { name: string; price: number }) => {
      const res = await apiRequest("POST", "/api/delivery-zones", { name, price });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-zones"] });
      setNewZoneName("");
      setNewZonePrice("");
      toast({ title: "تمت الإضافة", description: "تمت إضافة منطقة التوصيل بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "خطأ", description: "فشل إضافة المنطقة" });
    }
  });

  const updateZoneMutation = useMutation({
    mutationFn: async ({ id, name, price }: { id: number; name?: string; price?: number }) => {
      const res = await apiRequest("PATCH", `/api/delivery-zones/${id}`, { name, price });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-zones"] });
      toast({ title: "تم التحديث", description: "تم تحديث منطقة التوصيل بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث المنطقة" });
    }
  });

  const deleteZoneMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/delivery-zones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/delivery-zones"] });
      toast({ title: "تم الحذف", description: "تم حذف منطقة التوصيل" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "خطأ", description: "فشل حذف المنطقة" });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      description: string;
      price: number;
      priceUnit: string;
      priceUnitAmount: number;
      categoryId: number | null;
      image: string;
      isPopular: boolean;
    }) => {
      const res = await apiRequest("POST", "/api/products", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setNewProductName("");
      setNewProductDescription("");
      setNewProductPrice("");
      setNewProductUnit("piece");
      setNewProductAmount("1");
      setNewProductCategory("");
      setNewProductIsPopular(false);
      setNewProductImage("");
      setImagePreview("");
      toast({ title: "تمت الإضافة", description: "تمت إضافة المنتج بنجاح" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "خطأ", description: "فشل إضافة المنتج" });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "تم الحذف", description: "تم حذف المنتج" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "خطأ", description: "فشل حذف المنتج" });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      const authRes = await fetch("/api/imagekit/auth");
      const authData = await authRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || "public_4l0/ccnm37/RAa+nVPNSBzyC1Pg=");
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);

      const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      
      if (uploadData.url) {
        setNewProductImage(uploadData.url);
        toast({ title: "تم الرفع", description: "تم رفع الصورة بنجاح" });
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({ variant: "destructive", title: "خطأ", description: "فشل رفع الصورة" });
      setImagePreview("");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddProduct = () => {
    const price = parseFloat(newProductPrice);
    const amount = parseFloat(newProductAmount);
    
    if (!newProductName.trim() || !newProductDescription.trim() || isNaN(price) || price < 0 || !newProductImage) {
      toast({ variant: "destructive", title: "خطأ", description: "يرجى ملء جميع الحقول المطلوبة" });
      return;
    }

    createProductMutation.mutate({
      name: newProductName.trim(),
      description: newProductDescription.trim(),
      price: Math.round(price * 100),
      priceUnit: newProductUnit,
      priceUnitAmount: amount || 1,
      categoryId: newProductCategory ? parseInt(newProductCategory) : null,
      image: newProductImage,
      isPopular: newProductIsPopular
    });
  };

  const handleAddZone = () => {
    const price = parseFloat(newZonePrice);
    if (newZoneName.trim() && !isNaN(price) && price >= 0) {
      createZoneMutation.mutate({ name: newZoneName.trim(), price: Math.round(price * 100) });
    }
  };

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
      <main className="flex-1 container mx-auto px-4 py-32 space-y-12">
        <section>
          <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-primary" />
            إضافة منتج جديد
          </h2>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>منتج جديد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">اسم المنتج *</Label>
                  <Input
                    id="product-name"
                    placeholder="اسم المنتج"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    data-testid="input-new-product-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-category">الفئة</Label>
                  <Select value={newProductCategory} onValueChange={setNewProductCategory}>
                    <SelectTrigger data-testid="select-new-product-category">
                      <SelectValue placeholder="اختر الفئة" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-description">وصف المنتج *</Label>
                <Textarea
                  id="product-description"
                  placeholder="وصف المنتج"
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  data-testid="input-new-product-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-price">السعر (د.أ) *</Label>
                  <Input
                    id="product-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    data-testid="input-new-product-price"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-amount">الكمية</Label>
                  <Input
                    id="product-amount"
                    type="number"
                    step="0.25"
                    min="0.01"
                    placeholder="1"
                    value={newProductAmount}
                    onChange={(e) => setNewProductAmount(e.target.value)}
                    data-testid="input-new-product-amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Select value={newProductUnit} onValueChange={(v) => setNewProductUnit(v as PriceUnit)}>
                    <SelectTrigger data-testid="select-new-product-unit">
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
              </div>

              <div className="space-y-2">
                <Label>صورة المنتج *</Label>
                <div className="flex gap-4 items-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="input-product-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    data-testid="button-upload-image"
                  >
                    {uploadingImage ? (
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 ml-2" />
                    )}
                    {uploadingImage ? "جاري الرفع..." : "رفع صورة"}
                  </Button>
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                      {newProductImage && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <ImageIcon className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="product-popular"
                  checked={newProductIsPopular}
                  onCheckedChange={(checked) => setNewProductIsPopular(!!checked)}
                  data-testid="checkbox-product-popular"
                />
                <Label htmlFor="product-popular">منتج شائع</Label>
              </div>

              <Button
                onClick={handleAddProduct}
                disabled={createProductMutation.isPending || uploadingImage || !newProductImage}
                className="w-full"
                data-testid="button-add-product"
              >
                {createProductMutation.isPending ? (
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 ml-2" />
                )}
                إضافة المنتج
              </Button>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section>
          <h1 className="text-4xl font-display font-bold mb-8">إدارة المنتجات والأسعار</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map((product) => (
                <div key={product.id} className="relative">
                  <ProductPriceCard 
                    product={product} 
                    onUpdate={(data) => mutation.mutate(data)}
                    isPending={mutation.isPending}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 left-2"
                    onClick={() => deleteProductMutation.mutate(product.id)}
                    disabled={deleteProductMutation.isPending}
                    data-testid={`button-delete-product-${product.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        <Separator />

        <section>
          <h2 className="text-3xl font-display font-bold mb-8 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary" />
            مناطق التوصيل
          </h2>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>إضافة منطقة جديدة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                <Input
                  placeholder="اسم المنطقة"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  className="flex-1 min-w-[200px]"
                  data-testid="input-new-zone-name"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="سعر التوصيل"
                    value={newZonePrice}
                    onChange={(e) => setNewZonePrice(e.target.value)}
                    className="w-32"
                    data-testid="input-new-zone-price"
                  />
                  <span className="text-muted-foreground">د.أ</span>
                </div>
                <Button 
                  onClick={handleAddZone}
                  disabled={createZoneMutation.isPending}
                  data-testid="button-add-zone"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة
                </Button>
              </div>
            </CardContent>
          </Card>

          {isLoadingZones ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : deliveryZones && deliveryZones.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deliveryZones.map((zone) => (
                <DeliveryZoneCard
                  key={zone.id}
                  zone={zone}
                  onUpdate={(data) => updateZoneMutation.mutate(data)}
                  onDelete={(id) => deleteZoneMutation.mutate(id)}
                  isPending={updateZoneMutation.isPending || deleteZoneMutation.isPending}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              لا توجد مناطق توصيل. قم بإضافة منطقة جديدة أعلاه.
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
