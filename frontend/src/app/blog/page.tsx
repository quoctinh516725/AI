import React from "react";
import BlogCard from "@/components/blog/BlogCard";
import { BookOpen } from "lucide-react";

export default function BlogPage() {
  const mockBlogs = [
    {
      id: "b1",
      title: "Cách phòng tránh trẻ đi lạc nơi đông người",
      excerpt: "Những nguyên tắc vàng cha mẹ cần dạy trẻ để đảm bảo an toàn khi đến các khu vui chơi, siêu thị hoặc bến xe. Hướng dẫn trẻ ghi nhớ thông tin liên lạc và cách tìm kiếm sự trợ giúp đúng người.",
      imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60",
      date: "15/05/2026"
    },
    {
      id: "b2",
      title: "Công nghệ AI đang thay đổi cách chúng ta tìm người thân",
      excerpt: "Nhận diện khuôn mặt đã giúp hàng ngàn gia đình đoàn tụ. Tìm hiểu cách hệ thống phân tích hình ảnh của Beacons hoạt động và cách bạn có thể đóng góp vào mạng lưới tìm kiếm cộng đồng.",
      imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60",
      date: "12/05/2026"
    },
    {
      id: "b3",
      title: "Hành trang cần chuẩn bị khi đi tìm người thân thất lạc",
      excerpt: "Bên cạnh yếu tố tâm lý, bạn cần chuẩn bị đầy đủ giấy tờ, hình ảnh và liên hệ ngay với các cơ quan chức năng. Cẩm nang từng bước để không bị hoảng loạn trong 24 giờ đầu tiên.",
      imageUrl: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=800&auto=format&fit=crop&q=60",
      date: "10/05/2026"
    },
    {
      id: "b4",
      title: "Dấu hiệu nhận biết trẻ em hoặc người lớn tuổi cần giúp đỡ",
      excerpt: "Không phải ai đi lạc cũng có thể chủ động tìm kiếm sự giúp đỡ. Dưới đây là các dấu hiệu phổ biến và cách tiếp cận an toàn, nhân văn để hỗ trợ họ kết nối lại với gia đình.",
      imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=60",
      date: "05/05/2026"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <BookOpen size={16} /> Thông Tin & Cẩm Nang
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy mb-4">Kiến Thức & Kinh Nghiệm</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Tổng hợp các bài viết hướng dẫn an toàn, kỹ năng tìm kiếm người thất lạc và những cập nhật mới nhất về công nghệ hỗ trợ cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBlogs.map(blog => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

      </div>
    </div>
  );
}
