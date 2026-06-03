import Link from "next/link";
import { Search, Heart } from "lucide-react";

export default function EncouragementBlock() {
  return (
    <section className="py-10 bg-white pb-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl rounded-[3rem] bg-blue-50/80 px-6 py-12 text-center sm:px-12 md:py-16 lg:px-24">
          
          {/* Heart Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30">
            <Heart size={32} className="text-white" fill="currentColor" />
          </div>

          {/* Title */}
          <h2 className="mb-6 font-sans text-3xl font-bold text-navy md:text-4xl">
            Bạn không đơn độc trong hành trình này
          </h2>

          {/* Body Text */}
          <p className="mx-auto mb-6 max-w-3xl text-lg text-slate-600 md:text-xl leading-relaxed">
            Chúng tôi hiểu rằng mỗi giây phút chờ đợi đều nặng nề và đau lòng đến nhường nào. Hãy tin rằng — mỗi bài đăng bạn chia sẻ, mỗi tìm kiếm bạn thực hiện đều là một ngọn nến thắp thêm hy vọng.
          </p>

          {/* Quote */}
          <p className="mb-10 font-medium italic text-blue-500 text-lg md:text-xl">
                        &quot;Yêu thương đủ mạnh sẽ vượt qua mọi khoảng cách. Chúng tôi ở đây cùng bạn.&quot;

          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/search" 
              className="flex items-center gap-2 rounded-full bg-[#0071C2] px-8 py-3.5 font-semibold text-white shadow-md hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
            >
              <Search size={18} />
              Bắt đầu tìm kiếm
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center gap-2 rounded-full border border-blue-200 bg-white px-8 py-3.5 font-semibold text-[#0071C2] hover:bg-blue-50 transition-colors w-full sm:w-auto justify-center"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
