import { Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white border-2 border-primary/20">
                <img 
                  src="/attached_assets/67b44034-7853-4948-8a1a-55382670af9a_1769435846205.jpeg" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-display text-3xl font-bold text-white">مطبخ آدم</span>
            </div>
            <p className="text-white/60 leading-relaxed max-w-xs">
              نقدم لكم أشهى المأكولات الشرقية المحضرة بكل حب وعناية، لننقل لكم طعم الأصالة في كل لقمة.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white font-display">روابط سريعة</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="/" className="hover:text-primary transition-colors">الرئيسية</a></li>
              <li><a href="/menu" className="hover:text-primary transition-colors">القائمة</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">اتصل بنا</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white font-display">تواصل معنا</h4>
            <ul className="space-y-4 text-white/70">
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span dir="ltr">+961 81 984 634</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span>info@adam-kitchen.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-6 text-white font-display">تابعنا</h4>
            <div className="flex gap-4">
              <a href="https://wa.me/96181984634" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Phone className="w-6 h-6" />
              </a>
              <a href="https://www.tiktok.com/@kitchen1adam?_d=secCgYIASAHKAESPgo8PCSC2Pau%2F1pEYRs6YGMcnJYHNprXvOxNtYqKL7BnzzR67Lw4aEhcYub7qupYgt8jUFRKHk1tjX%2BPSKRzGgA%3D&_r=1&object_id=7043135113269429249&page_open_method=scan_code&schema_type=4&sec_uid=MS4wLjABAAAA-KTGYTac53ievCR1tnhvy2WgjfyoCrcR6eSFFc9a10fb1MEUo1Btd-UOdsskVT7E&share_app_id=1233&share_author_id=7043135113269429249&share_uid=7424538430569546757&tt_from=scan_code&utm_campaign=client_scan_code&utm_medium=2&utm_source=scan_code" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 2.89 3.46 2.84 1.12-.03 2.19-.64 2.77-1.6.29-.51.48-1.09.53-1.67.08-2.73.04-5.46.05-8.19l-.04-.41z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4 text-center md:text-right">
          <p className="text-white/40 text-sm">
            © 2024 مطبخ آدم. جميع الحقوق محفوظة.
          </p>
          <p className="text-white/40 text-sm flex items-center gap-1">
            صمم بكل حب <span className="text-red-500">♥</span> للأكل الشرقي
          </p>
        </div>
      </div>
    </footer>
  );
}
