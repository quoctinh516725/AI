import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] py-16 px-4">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ. Nếu bạn cần giúp đỡ, có thông tin quan trọng hoặc muốn hợp tác, xin vui lòng liên hệ qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="bg-navy text-white rounded-[2rem] p-10 shadow-lg">
            <h2 className="text-2xl font-bold mb-8">Thông Tin Liên Hệ</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Đường dây nóng (24/7)</p>
                  <p className="text-xl font-bold">1900 1111</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Email hỗ trợ</p>
                  <p className="text-lg font-semibold">support@beacons.vn</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-blue-300" />
                </div>
                <div>
                  <p className="text-blue-200 text-sm mb-1">Trụ sở chính</p>
                  <p className="text-base leading-relaxed">
                    Tòa nhà Công Nghệ Cao, Khu Công Nghệ Cao, TP. Thủ Đức, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Gửi Tin Nhắn</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="Nhập tên của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email hoặc Số điện thoại</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="Để chúng tôi có thể phản hồi"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nội dung</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Chi tiết vấn đề bạn cần hỗ trợ..."
                ></textarea>
              </div>
              <button 
                type="button"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
              >
                <Send size={18} /> Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
