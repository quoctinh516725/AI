"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  User, MapPin, FileText, 
  Calendar, AlertCircle, CheckCircle2, ChevronLeft,
  Loader2, ImageIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    age: "",
    gender: "male",
    location: "",
    description: "",
    date_of_birth: "",
    lost_year: "",
    hometown: "",
  });

  useEffect(() => {
    if (!postId) return;
    fetchPostData();
  }, [postId]);

  const fetchPostData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Không thể tải thông tin bài đăng");
      }

      const post = result.data;
      setFormData({
        title: post.title || "",
        name: post.name || "",
        age: post.age ? post.age.toString() : "",
        gender: post.gender || "male",
        location: post.location || "",
        description: post.description || "",
        date_of_birth: post.date_of_birth ? post.date_of_birth.split("T")[0] : "",
        lost_year: post.lost_year ? post.lost_year.toString() : "",
        hometown: post.hometown || "",
      });
      setPreviewImage(post.image_url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation cơ bản
    if (!formData.title.trim()) return setError("Vui lòng nhập tiêu đề bài đăng");
    if (!formData.name.trim()) return setError("Vui lòng nhập tên người thất lạc");
    if (!formData.age || Number(formData.age) <= 0) return setError("Vui lòng nhập tuổi hợp lệ");
    if (!formData.location.trim()) return setError("Vui lòng nhập nơi thất lạc");
    if (!formData.description.trim()) return setError("Vui lòng nhập mô tả chi tiết");

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      const updateData = {
        title: formData.title,
        name: formData.name,
        age: Number(formData.age),
        gender: formData.gender,
        location: formData.location,
        description: formData.description,
        date_of_birth: formData.date_of_birth || undefined,
        lost_year: formData.lost_year ? Number(formData.lost_year) : undefined,
        hometown: formData.hometown || undefined,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra khi cập nhật bài đăng");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/my-posts");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
          <p className="text-slate-500 font-medium">Đang tải thông tin bài đăng...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={80} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Cập nhật thành công!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Hồ sơ tìm kiếm đã được cập nhật thành công.
          </p>
          <p className="text-sm text-slate-400">Đang chuyển hướng về quản lý bài đăng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/my-posts" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-navy mb-4 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Quay lại Quản lý bài đăng
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy">Chỉnh Sửa Hồ Sơ</h1>
          <p className="text-slate-600 mt-2">Cập nhật thông tin chi tiết để hỗ trợ hệ thống tìm kiếm hiệu quả hơn.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Hình ảnh & Tiêu đề */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><FileText size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">Hình ảnh & Tiêu đề</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Display */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-full aspect-[4/5] max-w-sm rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                  {previewImage ? (
                    <Image src={previewImage} alt="Post preview" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <ImageIcon size={48} className="mb-2 opacity-50" />
                      <p className="text-sm font-medium">Không có hình ảnh</p>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-sm">
                    <AlertCircle size={14} className="text-amber-500" /> Ảnh nhận diện (Không thể sửa)
                  </div>
                </div>
              </div>

              {/* Title & Basic Data */}
              <div className="flex flex-col gap-5 justify-center">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tiêu đề bài đăng <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="VD: Tìm con trai thất lạc ở bến xe Mỹ Đình..." 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                  />
                </div>
                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100">
                  <h4 className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
                    <AlertCircle size={16} /> Lưu ý cập nhật
                  </h4>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4 mt-2">
                    <li>Ảnh của hồ sơ không thể thay đổi để tránh sai lệch dữ liệu quét AI.</li>
                    <li>Cố gắng ghi rõ mô tả để tăng tỉ lệ tìm kiếm thành công.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin cá nhân */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-green-50 rounded-xl text-green-600"><User size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">Thông tin người thất lạc</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập đầy đủ họ tên..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tuổi <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    placeholder="VD: 12" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Giới tính <span className="text-red-500">*</span></label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none appearance-none text-slate-900"
                  >
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">Ngày sinh <span className="text-slate-400 font-normal">(Không bắt buộc)</span></label>
                <input 
                  type="date" 
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">Quê quán <span className="text-slate-400 font-normal">(Không bắt buộc)</span></label>
                <input 
                  type="text" 
                  name="hometown"
                  value={formData.hometown}
                  onChange={handleChange}
                  placeholder="VD: Hải Hậu, Nam Định..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Chi tiết thất lạc */}
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-orange-50 rounded-xl text-orange-600"><MapPin size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">Hoàn cảnh thất lạc</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nơi thất lạc / Nơi ở cuối cùng <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="VD: Chợ Bến Thành, Quận 1..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">Năm thất lạc <span className="text-slate-400 font-normal">(Không bắt buộc)</span></label>
                <input 
                  type="number" 
                  name="lost_year"
                  value={formData.lost_year}
                  onChange={handleChange}
                  placeholder="VD: 2015" 
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả đặc điểm nhận dạng & Hoàn cảnh <span className="text-red-500">*</span></label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Mô tả các đặc điểm nổi bật như: vết sứt, nốt ruồi, quần áo mặc khi thất lạc, hoặc bất kỳ thông tin nào giúp ích cho việc tìm kiếm..." 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-colors outline-none resize-y text-slate-900"
              ></textarea>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 pb-10">
            <Link 
              href="/my-posts"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-center"
            >
              Hủy bỏ
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-navy hover:bg-navy/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </button>
          </div>
          
        </form>

      </div>
    </div>
  );
}
