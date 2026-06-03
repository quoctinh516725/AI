"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, MapPin, Calendar, User, Phone, Share2, AlertCircle, Loader2, Info } from "lucide-react";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Không thể tải thông tin hồ sơ.");
        }

        setPost(result.data);
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin hồ sơ...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] py-12 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy hồ sơ</h2>
          <p className="text-slate-600 mb-8">{error || "Hồ sơ này có thể đã bị xóa hoặc không tồn tại."}</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors"
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    );
  }

  // Formatting values
  const isUrgent = post.status === "PENDING";
  const lostDateFormatted = post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : "Chưa cập nhật";
  
  const dateOfBirthFormatted = post.date_of_birth ? new Date(post.date_of_birth).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }) : "Chưa cập nhật";

  const defaultImage = "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Breadcrumb / Back button */}
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-navy mb-6 transition-colors"
        >
          <ChevronLeft size={16} className="mr-1" /> Quay lại
        </button>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-12 gap-0">
            
            {/* Cột trái: Hình ảnh */}
            <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col border-r border-slate-100">
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm bg-white border border-slate-200">
                <Image 
                  src={post.image_url || defaultImage}
                  alt={`Ảnh của ${post.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
                
                {isUrgent && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold shadow-md flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Cần tìm gấp
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 font-semibold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100/50">
                  <Share2 size={18} /> Chia sẻ hồ sơ này
                </button>
              </div>
            </div>

            {/* Cột phải: Thông tin chi tiết */}
            <div className="md:col-span-7 p-8 md:p-10 flex flex-col">
              
              {/* Header Info */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{post.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm text-slate-700">{post.age} tuổi</span>
                  {post.gender && <span className="bg-slate-100 px-3 py-1 rounded-lg text-sm text-slate-700">{post.gender}</span>}
                  <span className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> Nhận tin: {lostDateFormatted}</span>
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                  <Info size={20} className="text-blue-500" /> Đặc điểm nhận dạng & Thông tin
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div>
                    <span className="block text-slate-500 mb-1">Ngày sinh</span>
                    <span className="font-semibold text-slate-800">{dateOfBirthFormatted}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Quê quán</span>
                    <span className="font-semibold text-slate-800">{post.hometown || "Chưa cập nhật"}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Năm thất lạc</span>
                    <span className="font-semibold text-slate-800">{post.lost_year || "Chưa xác định"}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="block text-slate-500 mb-1">Khu vực thất lạc cuối cùng</span>
                    <span className="font-semibold text-slate-800 flex items-start gap-1">
                      <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                      {post.location}
                    </span>
                  </div>
                </div>

                <div className="mt-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <span className="block text-slate-500 mb-2 font-medium">Mô tả thêm:</span>
                  <p className="text-slate-700 leading-relaxed">
                    {post.description || "Không có mô tả bổ sung."}
                  </p>
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div className="mt-auto pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Thông tin liên hệ báo tin</h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                      <User size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-blue-100 text-sm font-medium mb-0.5">Người đăng bài</p>
                      <p className="font-bold text-lg">{post.author?.username || "Ẩn danh"}</p>
                    </div>
                  </div>
                  
                  <a 
                    href={`tel:${post.author?.phone}`} 
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-sm"
                  >
                    <Phone size={18} /> {post.author?.phone || "Không có SĐT"}
                  </a>
                </div>
                
                <p className="text-xs text-center text-slate-400 mt-4 italic">
                  * Mọi thông tin cung cấp đều có giá trị vô cùng to lớn. Chúng tôi cam kết bảo mật thông tin người cung cấp tin.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
