import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const LighthouseIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 9h8" />
    <path d="M9 4h6" />
    <path d="m11 4-1-2h4l-1 2" />
    <path d="m9 9-2 13" />
    <path d="m15 9 2 13" />
    <path d="M14 22H10" />
    <path d="M7 13h10" />
    <path d="M6 17h12" />
    <path d="M3 22h18" />
    <circle cx="12" cy="6.5" r="1.5" className="fill-gold stroke-none animate-pulse" />
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default function Footer() {
  return (
    <footer className="bg-navy text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-navy transition-transform group-hover:scale-105">
                <LighthouseIcon size={24} />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight">
                Beacons
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              Hệ thống trí tuệ nhân tạo nhận diện khuôn mặt hỗ trợ tìm kiếm người thân thất lạc phi lợi nhuận. Thắp sáng hy vọng, mang yêu thương trở về.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors">
                <FacebookIcon size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors">
                <TwitterIcon size={18} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-navy transition-colors">
                <InstagramIcon size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-white">Liên kết nhanh</h3>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-gold transition-colors">Trang chủ</Link></li>
              <li><Link href="/posts" className="hover:text-gold transition-colors">Danh sách tìm kiếm</Link></li>
              <li><Link href="/create" className="hover:text-gold transition-colors">Đăng tin khẩn cấp</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">Về chúng tôi</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-white">Hỗ trợ pháp lý</h3>
            <ul className="flex flex-col gap-3 text-gray-400 text-sm">
              <li><Link href="/terms" className="hover:text-gold transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link href="/privacy" className="hover:text-gold transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/guidelines" className="hover:text-gold transition-colors">Tiêu chuẩn cộng đồng</Link></li>
              <li><Link href="/partners" className="hover:text-gold transition-colors">Tổ chức đối tác</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-6 text-white">Liên hệ</h3>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 text-gold" />
                <span>Khu Công nghệ cao, Thành phố Thủ Đức, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0 text-gold" />
                <span>Hotline: 1800 599 920</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-gold" />
                <span>Email: support@beacons.vn</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Beacons Project. All rights reserved. Không vì mục đích thương mại.</p>
        </div>
      </div>
    </footer>
  );
}
