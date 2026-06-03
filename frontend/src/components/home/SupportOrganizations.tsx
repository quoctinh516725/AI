import { ShieldCheck, Heart, Users, Phone } from "lucide-react";

export default function SupportOrganizations() {
  return (
    <section className="border-t border-b border-slate-50 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
          Được hỗ trợ bởi các tổ chức uy tín
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-700 transition-transform hover:scale-105 duration-300">
            <ShieldCheck className="w-7 h-7 md:w-8 md:h-8 text-blue-600" /> 
            <span>Công An Nhân Dân</span>
          </div>
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-700 transition-transform hover:scale-105 duration-300">
            <Heart className="w-7 h-7 md:w-8 md:h-8 text-red-500 fill-red-500/10" /> 
            <span>Hội Chữ Thập Đỏ</span>
          </div>
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-700 transition-transform hover:scale-105 duration-300">
            <Users className="w-7 h-7 md:w-8 md:h-8 text-emerald-600" /> 
            <span>Cục Cứu Hộ</span>
          </div>
          <div className="flex items-center gap-2 text-lg md:text-xl font-bold text-slate-700 transition-transform hover:scale-105 duration-300">
            <Phone className="w-7 h-7 md:w-8 md:h-8 text-amber-500" /> 
            <span>Tổng đài 111</span>
          </div>
        </div>
      </div>
    </section>
  );
}

