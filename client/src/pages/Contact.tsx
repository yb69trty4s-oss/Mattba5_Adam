import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم إرسال رسالتك بنجاح",
        description: "شكراً لتواصلك معنا، سنقوم بالرد عليك في أقرب وقت.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navigation />

      <div className="pt-32 pb-12 px-4 container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">تواصل معنا</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            نسعد دائماً باستقبال استفساراتكم وملاحظاتكم
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card p-8 rounded-3xl shadow-lg border border-border"
          >
            <h2 className="text-2xl font-bold font-display mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">الاسم</label>
                  <Input id="name" required placeholder="اسمك الكريم" className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input id="email" type="email" required placeholder="example@mail.com" className="rounded-xl h-12" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">الموضوع</label>
                <Input id="subject" required placeholder="عنوان الرسالة" className="rounded-xl h-12" />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">الرسالة</label>
                <Textarea id="message" required placeholder="اكتب رسالتك هنا..." className="rounded-xl min-h-[150px] resize-none" />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-lg font-bold gap-2">
                {isSubmitting ? "جاري الإرسال..." : "إرسال الرسالة"}
                {!isSubmitting && <Send className="w-4 h-4 rtl-flip" />}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10">
              <h3 className="text-2xl font-bold font-display mb-6 text-primary">معلومات الاتصال</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">رقم الهاتف (WhatsApp)</h4>
                    <p className="text-muted-foreground" dir="ltr">+961 81 984 634</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">البريد الإلكتروني</h4>
                    <p className="text-muted-foreground">info@adam-kitchen.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.84 1.12-.03 2.19-.64 2.77-1.6.29-.51.48-1.09.53-1.67.08-2.73.04-5.46.05-8.19l-.04-.41z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">تيك توك</h4>
                    <a 
                      href="https://www.tiktok.com/@kitchen1adam?_d=secCgYIASAHKAESPgo8PCSC2Pau%2F1pEYRs6YGMcnJYHNprXvOxNtYqKL7BnzzR67Lw4aEhcYub7qupYgt8jUFRKHk1tjX%2BPSKRzGgA%3D&_r=1&object_id=7043135113269429249&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAA-KTGYTac53ievCR1tnhvy2WgjfyoCrcR6eSFFc9a10fb1MEUo1Btd-UOdsskVT7E&share_app_id=1233&share_author_id=7043135113269429249&share_uid=7424538430569546757&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @kitchen1adam
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-primary shadow-sm shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">ساعات العمل</h4>
                    <p className="text-muted-foreground">يومياً من 10:00 صباحاً - 11:00 مساءً</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-3xl overflow-hidden h-64 shadow-lg border border-border">
              {/* TikTok instead of Map */}
              <div className="w-full h-full bg-muted flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1611605698335-8b1c7170a6e2?w=800&auto=format&fit=crop&q=60" 
                  alt="TikTok" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <a 
                    href="https://www.tiktok.com/@kitchen1adam?_d=secCgYIASAHKAESPgo8PCSC2Pau%2F1pEYRs6YGMcnJYHNprXvOxNtYqKL7BnzzR67Lw4aEhcYub7qupYgt8jUFRKHk1tjX%2BPSKRzGgA%3D&_r=1&object_id=7043135113269429249&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAA-KTGYTac53ievCR1tnhvy2WgjfyoCrcR6eSFFc9a10fb1MEUo1Btd-UOdsskVT7E&share_app_id=1233&share_author_id=7043135113269429249&share_uid=7424538430569546757&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" className="shadow-lg font-bold">
                      تابعنا على تيك توك
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
