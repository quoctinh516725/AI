import React from "react";
import { Heart, Shield, Users, Target } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-24 bg-[#F4F7FB] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <Heart size={16} /> Về Beacons
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy mb-6">Mang Hi Vọng Về Nhà</h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Chúng tôi ứng dụng sức mạnh của Trí tuệ Nhân tạo (AI) vào việc nhận diện khuôn mặt, nhằm hỗ trợ cộng đồng và các cơ quan chức năng rút ngắn thời gian tìm kiếm người thất lạc.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-800">Giá Trị Cốt Lõi</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="bg-slate-50 p-8 rounded-[2rem] text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Sứ Mệnh</h3>
            <p className="text-slate-600">
              Không để bất kỳ một gia đình nào phải từ bỏ hi vọng. Chúng tôi xây dựng một nền tảng công nghệ mạnh mẽ, kết nối dữ liệu nhanh chóng và chính xác.
            </p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Cộng Đồng</h3>
            <p className="text-slate-600">
              Beacons là sức mạnh của sự chung tay. Một lượt chia sẻ, một bức ảnh được tải lên cũng có thể là chìa khóa mở ra cánh cửa đoàn tụ.
            </p>
          </div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] text-center hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Bảo Mật & Tôn Trọng</h3>
            <p className="text-slate-600">
              Mọi dữ liệu hình ảnh và thông tin cá nhân đều được mã hóa, bảo vệ nghiêm ngặt và chỉ phục vụ duy nhất cho mục đích nhân đạo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
