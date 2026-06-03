import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Heart, ChevronRight } from "lucide-react";

export interface MissingPersonProps {
  id: string;
  name: string;
  age: number;
  location: string;
  lostDate: string;
  status: "PENDING" | "CONFIRMED" | "FOUND";
  imageUrl: string;
  isUrgent?: boolean;
  similarityScore?: number;
}

interface Props {
  person: MissingPersonProps;
  variant?: "grid" | "list";
}

export default function MissingPersonCard({ person, variant = "grid" }: Props) {
  if (variant === "list") {
    return (
      <div className="group flex items-center justify-between gap-4 overflow-hidden rounded-[20px] border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-slate-200">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[12px] bg-slate-50 border border-slate-100">
            <Image 
              src={person.imageUrl} 
              alt={person.name} 
              fill 
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" 
              sizes="80px" 
            />
          </div>
          <div className="flex flex-col">
            <h3 className="font-sans text-lg font-bold text-slate-800 line-clamp-1">
              {person.name} <span className="text-slate-400 font-normal text-sm ml-1">• {person.age} tuổi</span>
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /> Ngày: {person.lostDate}</span>
              <span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> Thất lạc tại: {person.location}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-2">
          <Link href={`/post/${person.id}`} className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center gap-0.5 transition-colors">
            Chi tiết <ChevronRight size={16} />
          </Link>
          <button type="button" className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Quan tâm & Chia sẻ">
            <Heart size={16} />
          </button>
        </div>
      </div>
    );
  }

  // Default Grid Variant
  return (
    <div className="bg-white rounded-[24px] p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
      
      {/* Image Container - Thiết kế dạng khung ảnh nâng niu */}
      <div className="relative aspect-[4/5] w-full rounded-[16px] overflow-hidden bg-slate-50 mb-4 border border-slate-100/50">
        <Image 
          src={person.imageUrl} 
          alt={`Ảnh của ${person.name}`}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        
        {/* Lớp phủ gradient nhẹ dưới đáy ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badges Over Image */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {person.isUrgent && (
            <div className="bg-white/95 backdrop-blur-md text-red-600 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wide font-bold flex items-center gap-2 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Cần tìm gấp
            </div>
          )}
        </div>

        {person.similarityScore !== undefined && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-emerald-600 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wide font-bold flex items-center gap-1.5 shadow-sm z-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Độ chính xác: {((1 - person.similarityScore) * 100).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Info Container - Bố cục thấu cảm, kể chuyện */}
      <div className="px-2 flex flex-col flex-1 pb-1">
        <h3 className="text-[1.1rem] font-semibold text-slate-800 mb-1 leading-snug line-clamp-1">
          {person.name} <span className="text-slate-400 font-normal text-sm ml-1">• {person.age} tuổi</span>
        </h3>
        
        <div className="space-y-3 mt-3 mb-5 flex-1">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-slate-50 rounded-full p-1.5 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wider mb-0.5">Khu vực thất lạc</span>
              <span className="line-clamp-2">{person.location}</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 bg-slate-50 rounded-full p-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-sm text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-700 block text-xs uppercase tracking-wider mb-0.5">Thời gian nhận tin</span>
              {person.lostDate}
            </div>
          </div>
        </div>

        {/* Action Area - Thay thế nút bấm bằng lời kêu gọi tinh tế */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <Link 
            href={`/post/${person.id}`} 
            className="text-blue-600 font-semibold text-sm hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            Xem chi tiết hồ sơ <ChevronRight className="w-4 h-4" />
          </Link>
          <button 
            type="button" 
            className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" 
            title="Quan tâm & Chia sẻ"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


