"use client";

import React, { useState, useEffect } from "react";
import MissingPersonCard, { MissingPersonProps } from "../post/MissingPersonCard";
import BlogCard from "../blog/BlogCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Component hiển thị Skeleton cho thẻ bài đăng
const SkeletonCard = () => (
  <div className="flex flex-col overflow-hidden rounded-[24px] border border-slate-100 bg-white p-3 shadow-sm animate-pulse">
    <div className="aspect-[4/5] w-full bg-slate-100 rounded-[16px] mb-4"></div>
    <div className="px-2 flex flex-col flex-1 pb-1">
      <div className="h-6 bg-slate-100 rounded-md w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-100 rounded-md w-full mb-2"></div>
      <div className="h-4 bg-slate-100 rounded-md w-5/6 mb-5"></div>
      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between">
        <div className="h-5 bg-slate-100 rounded w-1/3"></div>
        <div className="h-5 w-5 bg-slate-100 rounded-full"></div>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ 
  title, 
  subtitle, 
  showViewAll = false, 
  viewAllHref = "#" 
}: { 
  title: React.ReactNode; 
  subtitle?: string; 
  showViewAll?: boolean; 
  viewAllHref?: string;
}) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-50 pb-4">
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-2">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-2 text-sm md:text-base leading-relaxed">{subtitle}</p>}
    </div>
    {showViewAll && (
      <Link href={viewAllHref} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold group text-sm md:text-base shrink-0">
        Xem tất cả 
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Link>
    )}
  </div>
);

export default function RecentPosts() {
  const [urgentPosts, setUrgentPosts] = useState<MissingPersonProps[]>([]);
  const [olderPosts, setOlderPosts] = useState<MissingPersonProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Tạm thời gọi API lấy số lượng lớn để chia làm 2 list
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=20`);
        const result = await response.json();

        if (response.ok && result.data?.data) {
          const mappedPosts: MissingPersonProps[] = result.data.data.map((post: any) => ({
            id: post.id,
            name: post.name,
            age: post.age,
            location: post.location,
            lostDate: new Date(post.createdAt).toLocaleDateString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            }),
            status: post.status === "CONFIRMED" ? "CONFIRMED" : (post.status === "FOUND" ? "FOUND" : "PENDING"),
            imageUrl: post.image_url || "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=800&auto=format&fit=crop&q=60",
            isUrgent: post.status === "PENDING",
          }));

          setUrgentPosts(mappedPosts.filter(p => p.isUrgent));
          setOlderPosts(mappedPosts.filter(p => !p.isUrgent));
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách bài đăng trang chủ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section: Urgent / Recent */}
        <div className="mb-20">
          <SectionHeader 
            title={
              <span className="flex items-center gap-3">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                </span>
                Khẩn cấp - Vừa thất lạc
              </span>
            } 
            subtitle="Cần sự chú ý ngay lập tức từ cộng đồng. Thời gian vàng để tìm kiếm là trong 24h đầu."
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {loading ? (
              Array(4).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
            ) : urgentPosts.length > 0 ? (
              urgentPosts.slice(0, 4).map((post) => (
                <MissingPersonCard key={post.id} person={post} variant="grid" />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100/80">
                <p>Hiện không có trường hợp khẩn cấp nào.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section: Older */}
        <div className="mb-20">
          <SectionHeader 
            title="Những trường hợp đang tìm" 
            subtitle="Hệ thống AI vẫn đang liên tục quét dữ liệu mỗi ngày cho các hồ sơ này."
            showViewAll={true}
            viewAllHref="/posts"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {loading ? (
              Array(4).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
            ) : olderPosts.length > 0 ? (
              olderPosts.slice(0, 4).map((post) => (
                <MissingPersonCard key={post.id} person={post} variant="grid" />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-3xl border border-slate-100/80">
                <p>Chưa có thông tin cho chuyên mục này.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section: Blog / Thông tin */}
        <div className="mb-10">
          <SectionHeader 
            title="Thông tin & Kinh nghiệm" 
            subtitle="Cẩm nang an toàn, kỹ năng tìm kiếm và cập nhật mới nhất về công nghệ hỗ trợ."
            showViewAll={true}
            viewAllHref="/blog"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                id: "b1",
                title: "Cách phòng tránh trẻ đi lạc nơi đông người",
                excerpt: "Những nguyên tắc vàng cha mẹ cần dạy trẻ để đảm bảo an toàn khi đến các khu vui chơi, siêu thị hoặc bến xe...",
                imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=60",
                date: "15/05/2026"
              },
              {
                id: "b2",
                title: "Công nghệ AI đang thay đổi cách chúng ta tìm người thân",
                excerpt: "Nhận diện khuôn mặt đã giúp hàng ngàn gia đình đoàn tụ. Tìm hiểu cách hệ thống phân tích hình ảnh của Beacons hoạt động.",
                imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60",
                date: "12/05/2026"
              },
              {
                id: "b3",
                title: "Hành trang cần chuẩn bị khi đi tìm người thân thất lạc",
                excerpt: "Bên cạnh yếu tố tâm lý, bạn cần chuẩn bị đầy đủ giấy tờ, hình ảnh và liên hệ ngay với các cơ quan chức năng.",
                imageUrl: "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=800&auto=format&fit=crop&q=60",
                date: "10/05/2026"
              }
            ].map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


