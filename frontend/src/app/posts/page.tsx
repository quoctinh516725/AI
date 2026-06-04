"use client";

import React, { useState, useEffect } from "react";
import MissingPersonCard, { MissingPersonProps } from "@/components/post/MissingPersonCard";
import { AlertCircle, Search, Filter, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";

let globalPostsCache: MissingPersonProps[] | null = null;
let globalFetchTime: number = 0;

export default function PostsPage() {
  const [posts, setPosts] = useState<MissingPersonProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Nếu có cache và cache còn mới (trong vòng 5 phút), sử dụng cache
    if (globalPostsCache && Date.now() - globalFetchTime < 5 * 60 * 1000) {
      setPosts(globalPostsCache);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();
    
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?page=1&limit=20`, {
          signal: abortController.signal
        });
        
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Lỗi khi tải danh sách bài đăng");
        }

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

        globalPostsCache = mappedPosts;
        globalFetchTime = Date.now();
        setPosts(mappedPosts);
        setError(null);
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log("Fetch aborted");
          return;
        }
        setError(err.message || "Không thể kết nối đến máy chủ");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Section */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-navy mb-4 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Quay lại trang chủ
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-navy">Danh Sách Tìm Kiếm</h1>
              <p className="text-slate-600 mt-2">Danh sách tất cả các trường hợp đang thất lạc và đang được tìm kiếm.</p>
            </div>
            
            {/* Thanh công cụ tìm kiếm & Lọc (Giao diện giả lập) */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={18} />
                </div>
                <input 
                  type="text" 
                  placeholder="Tìm kiếm theo tên, địa điểm..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
                <Filter size={18} /> <span className="hidden sm:inline">Lọc</span>
              </button>
            </div>
          </div>
        </div>

        {/* Xử lý các trạng thái: Loading, Lỗi, và Hiển thị danh sách */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
            <p className="font-semibold text-lg">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex flex-col items-center justify-center text-red-700 shadow-sm py-16">
            <AlertCircle size={48} className="mb-4 text-red-500 opacity-80" />
            <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi!</h3>
            <p className="text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có bài đăng nào</h3>
            <p className="text-slate-500 max-w-md mx-auto">Hiện tại hệ thống chưa ghi nhận hồ sơ tìm kiếm nào. Nếu bạn có thông tin cần đăng tải, hãy nhấn vào nút bên dưới.</p>
            <Link href="/create" className="inline-block mt-8 px-8 py-3 rounded-xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors">
              Đăng hồ sơ mới
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {posts.map((post) => (
              <MissingPersonCard key={post.id} person={post} variant="grid" />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
