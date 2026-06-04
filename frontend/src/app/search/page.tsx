"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, User, MapPin, Calendar, FileText, Search, Loader2 } from "lucide-react";
import MissingPersonCard, { MissingPersonProps } from "../../components/post/MissingPersonCard";

export default function SearchPage() {
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<MissingPersonProps[] | null>(null);

  // Image Upload State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Data with Mock Data
  const [formData, setFormData] = useState({
    name: "Nguyễn Văn A",
    age: "35",
    gender: "male",
    location: "Khu vực Bến xe Miền Đông, TP.HCM",
    hometown: "Bình Định",
    lost_year: "2023",
    date_of_birth: "1988-05-12"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearchResults(null);

    if (!imageFile) {
      setError("Vui lòng tải lên một hình ảnh để hệ thống AI nhận diện.");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("image", imageFile);
      if (formData.name) submitData.append("name", formData.name);
      if (formData.age) submitData.append("age", formData.age);
      if (formData.gender) submitData.append("gender", formData.gender);
      if (formData.location) submitData.append("location", formData.location);
      if (formData.hometown) submitData.append("hometown", formData.hometown);
      if (formData.lost_year) submitData.append("lost_year", formData.lost_year);
      if (formData.date_of_birth) submitData.append("date_of_birth", formData.date_of_birth);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search`, {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Tìm kiếm thất bại");
      }

      if (result.data && Array.isArray(result.data)) {
        const mappedResults: MissingPersonProps[] = result.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          age: item.age,
          location: item.location || "Không rõ",
          lostDate: new Date(item.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
          }),
          status: item.status === "CONFIRMED" ? "CONFIRMED" : (item.status === "FOUND" ? "FOUND" : "PENDING"),
          imageUrl: item.image_url || "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=800&auto=format&fit=crop&q=60",
          isUrgent: item.status === "PENDING",
          similarityScore: item.similarity_score
        }));
        setSearchResults(mappedResults);
      } else {
        setSearchResults([]);
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy tracking-tight mb-4">
            Tìm Kiếm Bằng <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Hệ thống nhận diện khuôn mặt sẽ phân tích hình ảnh và đối chiếu với cơ sở dữ liệu để tìm ra những hồ sơ có độ tương đồng cao nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Section */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
                <Search size={22} className="text-blue-500" />
                Thông tin tìm kiếm
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Image Upload Area */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Hình ảnh nhận diện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full aspect-square md:aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                      previewImage ? 'border-blue-500 bg-blue-50/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400'
                    }`}
                  >
                    {previewImage ? (
                      <>
                        <Image src={previewImage} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                            <Camera size={18} /> Đổi ảnh khác
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-500">
                          <Upload size={28} />
                        </div>
                        <p className="font-bold text-slate-700 mb-1">Tải ảnh lên để nhận diện</p>
                        <p className="text-xs text-slate-500 font-medium">PNG, JPG, JPEG (Tối đa 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Tên người tìm</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User size={16} />
                        </div>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="VD: Nguyễn Văn A"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Tuổi / Giới tính</label>
                      <div className="flex gap-2">
                        <input
                          type="number" name="age" value={formData.age} onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                          placeholder="Tuổi"
                        />
                        <select
                          name="gender" value={formData.gender} onChange={handleChange}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Khu vực thất lạc</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text" name="location" value={formData.location} onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Quê quán</label>
                      <input
                        type="text" name="hometown" value={formData.hometown} onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Năm thất lạc</label>
                      <input
                        type="number" name="lost_year" value={formData.lost_year} onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang tìm kiếm...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Tìm kiếm ngay
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 min-h-[600px]">
              
              {!searchResults && !isSubmitting && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-20">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Chưa có kết quả</h3>
                  <p className="max-w-md text-sm">Vui lòng tải ảnh và nhập thông tin ở biểu mẫu bên trái để bắt đầu tìm kiếm.</p>
                </div>
              )}

              {isSubmitting && (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-t-4 border-blue-500 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border-r-4 border-navy animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                      <Search size={24} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">Hệ thống AI đang phân tích...</h3>
                  <p className="text-slate-500 text-sm">Việc đối chiếu hàng ngàn khuôn mặt có thể mất vài giây. Vui lòng đợi.</p>
                </div>
              )}

              {searchResults && !isSubmitting && (
                <div>
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-2xl font-bold text-navy">Kết quả tìm kiếm</h2>
                      <p className="text-slate-500 font-medium text-sm mt-1">
                        Tìm thấy <span className="font-bold text-blue-600">{searchResults.length}</span> hồ sơ tương đồng
                      </p>
                    </div>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {searchResults.map((post) => (
                        <MissingPersonCard key={post.id} person={post} variant="grid" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 shadow-sm">
                        <User size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-2">Không tìm thấy hồ sơ phù hợp</h3>
                      <p className="text-slate-500 text-sm max-w-sm mx-auto">
                        Hệ thống không tìm thấy khuôn mặt nào trùng khớp với hình ảnh bạn cung cấp.
                      </p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
