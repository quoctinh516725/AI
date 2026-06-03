import Link from "next/link";
import Image from "next/image";
import { Search, PenSquare } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-navy text-white pb-16 pt-24 md:pt-32 md:pb-24">
      {/* Background Video with Light Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video 
          src="/banner.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-1/2 left-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
        />
        {/* Lớp gradient nhẹ nhàng để chữ vẫn nổi mà không làm tối video */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/20 to-navy" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Main Slogan - Changed to font-sans per user request */}
        <h1 className="mb-6 font-sans text-5xl font-extrabold tracking-tight leading-tight sm:text-6xl md:text-7xl lg:text-8xl sm:leading-tight md:leading-tight lg:leading-30 drop-shadow-lg">
          Thắp Sáng Hy Vọng<br className="hidden sm:block" />
          <span className="text-gold">Kết Nối Tình Thân</span>
        </h1>
        
        {/* Sub-slogan */}
        <p className="mx-auto mb-10 max-w-3xl text-lg text-gray-100 sm:text-xl md:text-2xl font-medium drop-shadow-md leading-relaxed">
          Như những cánh chim bồ câu mang tin lành, hãy để công nghệ của chúng tôi giúp bạn tìm lại người thân yêu thất lạc.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/create"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 font-semibold text-navy hover:bg-yellow-400 hover:shadow-xl hover:shadow-gold/30 transition-all text-lg"
          >
            <PenSquare size={20} className="transition-transform group-hover:-translate-y-1" />
            Đăng tin ngay
          </Link>
          <Link 
            href="/search"
            className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-sm px-8 py-4 font-semibold text-white hover:bg-white hover:text-navy transition-all text-lg"
          >
            <Search size={20} className="transition-transform group-hover:scale-110" />
            Tìm kiếm người thân
          </Link>
        </div>

        {/* Quick Stats / Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 text-sm md:text-base text-gray-200 drop-shadow-md">
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans text-3xl font-extrabold text-white">2,405</span>
            <span>Hồ sơ thất lạc</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans text-3xl font-extrabold text-gold">1,280</span>
            <span>Đã đoàn tụ</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans text-3xl font-extrabold text-white">AI</span>
            <span>Độ chính xác 99.8%</span>
          </div>
        </div>

      </div>
    </section>
  );
}
