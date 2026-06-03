"use client";

import React from "react";
import Image from "next/image";
import { Heart, Quote, ArrowRight } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Cột trái: Hình ảnh đầy thấu cảm & Khung trích dẫn */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 h-[420px] group border border-slate-100">
            <Image 
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&q=80&w=800&h=600" 
              alt="Đoàn tụ gia đình" 
              fill
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-blue-955/20 mix-blend-multiply"></div>
            
            {/* Hộp trích dẫn thấu cảm */}
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-slate-100/50 shadow-md">
              <Quote className="w-8 h-8 text-blue-500 mb-2 opacity-50" />
              <p className="text-slate-800 font-medium italic text-sm md:text-base leading-relaxed">
                "Mỗi bức ảnh được tải lên không chỉ là dữ liệu, đó là một niềm tin được gửi gắm, là khao khát được đoàn tụ mãnh liệt của một gia đình."
              </p>
            </div>
          </div>
          
          {/* Cột phải: Thông tin sứ mệnh */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 w-fit border border-blue-100/30">
              <Heart className="w-4 h-4 fill-current" /> 
              <span>Về Sứ Mệnh Của Chúng Tôi</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight tracking-tight">
              Hơn cả một công nghệ,<br className="hidden lg:block"/>đó là nhịp cầu của sự thấu cảm.
            </h2>
            
            <p className="text-slate-600 mb-5 leading-relaxed text-base">
              Beacons ra đời không chỉ với tư cách là một phần mềm nhận diện khuôn mặt. Chúng tôi là tập hợp của những con người tin rằng khoa học công nghệ phải luôn luôn phục vụ cho những giá trị nhân văn sâu sắc nhất. 
            </p>
            
            <p className="text-slate-600 mb-8 leading-relaxed text-base">
              Hệ thống AI của chúng tôi làm việc không ngừng nghỉ 24/7, liên tục quét và đối chiếu dữ liệu mỗi giây để đảm bảo không một cơ hội nào bị bỏ lỡ, không một hy vọng nhỏ nhoi nào bị lãng quên trên hành trình tìm kiếm người thân yêu.
            </p>
            
            <button className="bg-white border-2 border-blue-100 hover:border-blue-600 hover:bg-blue-50 text-blue-700 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 w-fit flex items-center gap-2 shadow-sm hover:shadow-md">
              <span>Tìm hiểu thêm về dự án</span> 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
}
