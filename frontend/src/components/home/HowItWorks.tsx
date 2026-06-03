import { UploadCloud, Cpu, Users } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <UploadCloud size={32} className="text-blue-500" />,
      title: "1. Đăng tải thông tin",
      desc: "Cung cấp hình ảnh rõ nét và các thông tin cơ bản về người thân thất lạc.",
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: <Cpu size={32} className="text-gold" />,
      title: "2. AI Phân tích & Tìm kiếm",
      desc: "Hệ thống AI sẽ nhận diện khuôn mặt và quét qua hàng ngàn hồ sơ để tìm kiếm sự trùng khớp.",
      color: "bg-gold",
      bgColor: "bg-yellow-50",
    },
    {
      icon: <Users size={32} className="text-green-500" />,
      title: "3. Kết nối & Đoàn tụ",
      desc: "Nhận thông báo ngay lập tức khi có kết quả trùng khớp để tiến hành xác minh và đoàn tụ.",
      color: "bg-green-500",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-yellow-100/40 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-sans text-3xl font-extrabold text-navy md:text-4xl mb-4">
            Hệ thống hoạt động như thế nào?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Công nghệ nhận diện khuôn mặt tiên tiến giúp rút ngắn thời gian tìm kiếm và mang lại hy vọng đoàn tụ cho các gia đình.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-1 bg-slate-200 z-0 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 via-gold to-green-400 opacity-70" />
            </div>
            
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                {/* Icon Container with Hover Animation */}
                <div className={`flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-xl shadow-slate-200/50 mb-8 border-4 border-white transition-transform duration-300 group-hover:-translate-y-2 relative`}>
                  {/* Outer subtle ring */}
                  <div className={`absolute inset-0 rounded-full ${step.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110`} />
                  
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full ${step.bgColor} transition-colors duration-300`}>
                    {step.icon}
                  </div>
                  
                  {/* Step number badge */}
                  <div className={`absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full ${step.color} text-white font-bold text-lg border-4 border-white shadow-sm`}>
                    {idx + 1}
                  </div>
                </div>

                {/* Text Content */}
                <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/40 border border-slate-100 w-full h-full flex flex-col items-center transition-all duration-300 group-hover:shadow-xl group-hover:border-blue-100">
                  <h3 className="font-sans text-xl font-bold text-navy mb-3">
                    {step.title.replace(/^\d+\.\s*/, '')} {/* Remove the "1. " from title since we have the badge */}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
