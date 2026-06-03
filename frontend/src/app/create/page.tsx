"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Camera, Upload, User, MapPin, FileText, 
  Calendar, AlertCircle, CheckCircle2, ChevronLeft 
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CreatePostPage() {
  const router = useRouter();
  
  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [similarPersons, setSimilarPersons] = useState<any[]>([]);
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPersonForDetail, setSelectedPersonForDetail] = useState<any>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'success' | 'warning';
  }>({
    show: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: 'warning'
  });

  // Form Data
  const [formData, setFormData] = useState({
    title: "Tìm người thân thất lạc tại ga Sài Gòn",
    name: "Trần Hữu Nam",
    age: "65",
    gender: "male",
    location: "Ga Sài Gòn, Quận 3, TP. Hồ Chí Minh",
    description: "Ông cao 1m65, dáng người gầy. Khi đi mặc áo sơ mi kẻ sọc xanh, quần tây đen. Ông có vết sẹo nhỏ ở đuôi mắt phải và trí nhớ kém. Đang mang theo một túi xách vải màu nâu.",
    date_of_birth: "1961-08-20",
    lost_year: "2026",
    hometown: "Nha Trang, Khánh Hòa",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    // Validation cơ bản
    if (!imageFile) return setError("Vui lòng tải lên một hình ảnh");
    if (!formData.title.trim()) return setError("Vui lòng nhập tiêu đề bài đăng");
    if (!formData.name.trim()) return setError("Vui lòng nhập tên người thất lạc");
    if (!formData.age || Number(formData.age) <= 0) return setError("Vui lòng nhập tuổi hợp lệ");
    if (!formData.location.trim()) return setError("Vui lòng nhập nơi thất lạc");
    if (!formData.description.trim()) return setError("Vui lòng nhập mô tả chi tiết");

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";

      // Dùng FormData vì có upload file
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("name", formData.name);
      submitData.append("age", formData.age);
      submitData.append("gender", formData.gender);
      submitData.append("location", formData.location);
      submitData.append("description", formData.description);
      submitData.append("image", imageFile);

      // Các trường không bắt buộc
      if (formData.date_of_birth) submitData.append("date_of_birth", formData.date_of_birth);
      if (formData.lost_year) submitData.append("lost_year", formData.lost_year);
      if (formData.hometown) submitData.append("hometown", formData.hometown);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Có lỗi xảy ra khi tạo bài đăng");
      }

      // Nếu có danh sách người giống (AI nhận dạng được)
      if (result.data?.similarPersons && result.data.similarPersons.length > 0) {
        setSimilarPersons(result.data.similarPersons);
        setPendingPostId(result.data.id);
        setShowConfirmModal(true);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/posts");
        }, 3000);
      }

    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến máy chủ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (selectedPersonId: string | null) => {
    if (!pendingPostId) return;
    
    setCustomConfirm(prev => ({ ...prev, show: false }));
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
      
      // Chuyển file sang base64 nếu reject (để tạo person mới)
      let image_base64 = "";
      if (!selectedPersonId && imageFile) {
        const reader = new FileReader();
        image_base64 = await new Promise((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(",")[1]);
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await fetch(`/api/posts/${pendingPostId}/confirm`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personId: selectedPersonId,
          image_base64: selectedPersonId ? undefined : image_base64
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Xác nhận thất bại");
      }

      setShowConfirmModal(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/posts");
      }, 3000);

    } catch (err: any) {
      setError(err.message || "Lỗi xác nhận");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-xl border border-slate-100">
          <div className="flex justify-center mb-6">
            <CheckCircle2 size={80} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Thành công!</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Hồ sơ tìm kiếm đã được gửi và xác nhận thành công. Cảm ơn bạn đã tin tưởng Beacons.
          </p>
          <p className="text-sm text-slate-400">Đang chuyển hướng về danh sách bài đăng...</p>
        </div>
      </div>
    );
  }
  console.log("selectedPersonForDetail", selectedPersonForDetail);
  

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-navy mb-4 transition-colors">
            <ChevronLeft size={16} className="mr-1" /> Quay lại trang chủ
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy">Tạo Hồ Sơ Tìm Kiếm</h1>
          <p className="text-slate-600 mt-2">Vui lòng cung cấp thông tin chi tiết và hình ảnh rõ nét để hệ thống AI nhận diện hiệu quả nhất.</p>
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
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Camera size={24} /></div>
              <h2 className="text-xl font-bold text-slate-800">Hình ảnh & Tiêu đề</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="flex flex-col items-center justify-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-full aspect-[4/5] max-w-sm rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer transition-all hover:bg-slate-50 ${previewImage ? 'border-transparent shadow-md' : 'border-slate-300 bg-slate-50 hover:border-blue-400'}`}
                >
                  {previewImage ? (
                    <>
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-semibold flex items-center gap-2"><Upload size={18} /> Đổi ảnh khác</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6 flex flex-col items-center text-slate-500">
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-500">
                        <Upload size={28} />
                      </div>
                      <p className="font-semibold text-slate-700 mb-1">Nhấn để tải ảnh lên</p>
                      <p className="text-xs text-slate-400">JPG, PNG, WEBP (Tối đa 5MB)</p>
                      <p className="text-xs text-red-500 mt-2 font-medium">* Ảnh rõ mặt sẽ giúp AI nhận diện tốt hơn</p>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="hidden" 
                />
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
                    <AlertCircle size={16} /> Lưu ý quan trọng
                  </h4>
                  <ul className="text-xs text-yellow-700 space-y-1 list-disc pl-4 mt-2">
                    <li>Chỉ đăng ảnh người thật, rõ nét, nhìn thẳng.</li>
                    <li>Không sử dụng ảnh bị mờ hoặc có quá nhiều người.</li>
                    <li>Thông tin sẽ được kiểm duyệt trước khi hiển thị công khai.</li>
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
              href="/"
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
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng thông tin tìm kiếm"
              )}
            </button>
          </div>
          
        </form>

        {/* Modal Xác nhận AI (Similarity Modal) */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-navy flex items-center gap-2">
                  <AlertCircle className="text-gold" /> Xác nhận thông tin nhận diện
                </h3>
                <button onClick={() => setShowConfirmModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div className="p-6 md:p-10 overflow-y-auto">
                <div className="bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100 mb-8">
                  <p className="text-blue-900 font-bold text-xl leading-relaxed text-center">
                    AI phát hiện hình ảnh có sự tương đồng với các hồ sơ hiện có. <br/>
                    <span className="text-navy text-base font-medium">Bạn vui lòng kiểm tra kỹ danh sách bên dưới để tránh tạo trùng lặp thông tin.</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarPersons.map((person) => (
                    <div key={person.personId} className="group flex flex-col rounded-[1.5rem] border border-slate-200 overflow-hidden bg-white transition-all hover:border-gold hover:shadow-xl">
                      <div className="relative aspect-[4/5] w-full overflow-hidden">
                        <Image src={person.image_url} alt={person.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-2 right-2 px-3 py-1 bg-gold text-navy text-[10px] font-bold rounded-full shadow-lg">
                          Độ trùng khớp cao
                        </div>
                      </div>
                      <div className="p-5 flex flex-col gap-3">
                        <div>
                          <h4 className="font-bold text-navy text-lg leading-tight">{person.name}</h4>
                          <p className="text-sm text-slate-500 font-medium">{person.age} tuổi • {person.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-2">
                          <button 
                            onClick={() => {
                              setSelectedPersonForDetail(person);
                              setShowDetailModal(true);
                            }}
                            className="w-full py-2 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                          >
                            <FileText size={16} /> Chi tiết thông tin
                          </button>
                          <button 
                            onClick={() => {
                              setCustomConfirm({
                                show: true,
                                title: "Xác nhận người thân",
                                message: `Bạn chắc chắn ${person.name} chính là người thân mà bạn đang tìm kiếm?`,
                                type: 'success',
                                onConfirm: () => handleConfirm(person.personId)
                              });
                            }}
                            className="w-full py-2.5 bg-navy text-white text-sm font-bold rounded-xl hover:bg-navy/90 transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <CheckCircle2 size={16} /> Đúng, là người này
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-between gap-4">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-navy transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => {
                    setCustomConfirm({
                      show: true,
                      title: "Tạo hồ sơ mới",
                      message: "Bạn xác nhận không có ai trong danh sách này trùng khớp? Chúng tôi sẽ tiến hành tạo một hồ sơ tìm kiếm hoàn toàn mới.",
                      type: 'warning',
                      onConfirm: () => handleConfirm(null)
                    });
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white border-2 border-navy text-navy text-sm font-bold rounded-xl hover:bg-navy hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  Không có ai trùng khớp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chi tiết người giống */}
        {showDetailModal && selectedPersonForDetail && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Header ảnh */}
              <div className="relative h-52 bg-navy flex-shrink-0">
                <div className="absolute -bottom-14 left-8 h-28 w-28 rounded-2xl border-4 border-white overflow-hidden shadow-xl bg-white">
                  <Image src={selectedPersonForDetail.image_url} alt="Detail" fill className="object-cover" />
                </div>
                <button onClick={() => setShowDetailModal(false)} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              <div className="pt-18 px-8 pb-8" style={{paddingTop: '4.5rem'}}>
                {/* Tên & badge */}
                <div className="mb-6">
                  <h3 className="text-3xl font-extrabold text-navy">{selectedPersonForDetail.name}</h3>
                  <p className="text-slate-500 font-medium mt-1">Người đang được cộng đồng tìm kiếm</p>
                </div>

                {/* Thông tin cơ bản dạng grid */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tuổi</p>
                    <p className="font-bold text-navy text-lg">{selectedPersonForDetail.age} tuổi</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Giới tính</p>
                    <p className="font-bold text-navy text-lg">{selectedPersonForDetail.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                  </div>
                  {selectedPersonForDetail.date_of_birth && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ngày sinh</p>
                      <p className="font-bold text-slate-700">{new Date(selectedPersonForDetail.date_of_birth).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                  {selectedPersonForDetail.lost_year && (
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Năm thất lạc</p>
                      <p className="font-bold text-slate-700">{selectedPersonForDetail.lost_year}</p>
                    </div>
                  )}
                </div>

                {/* Quê quán */}
                {selectedPersonForDetail.hometown && (
                  <div className="flex items-start gap-3 mb-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="mt-0.5 text-slate-400 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Quê quán</p>
                      <p className="font-semibold text-slate-700">{selectedPersonForDetail.hometown}</p>
                    </div>
                  </div>
                )}

                {/* Nơi thất lạc */}
                {selectedPersonForDetail.location && (
                  <div className="flex items-start gap-3 mb-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                    <div className="mt-0.5 text-orange-400 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-0.5">Nơi thất lạc</p>
                      <p className="font-semibold text-slate-700">{selectedPersonForDetail.location}</p>
                    </div>
                  </div>
                )}

                {/* Mô tả */}
                {selectedPersonForDetail.description && (
                  <div className="mb-5 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Mô tả đặc điểm nhận dạng</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedPersonForDetail.description}</p>
                  </div>
                )}

                {/* AI Notice */}
                <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex items-start gap-3 mb-6">
                  <AlertCircle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800 leading-relaxed font-medium">
                    Hệ thống AI nhận diện dựa trên đặc điểm khuôn mặt. Nếu bạn nhận ra người này, hãy xác nhận để liên kết hồ sơ.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                  >
                    Quay lại
                  </button>
                  <button 
                    onClick={() => {
                      setShowDetailModal(false);
                      setCustomConfirm({
                        show: true,
                        title: "Xác nhận người thân",
                        message: `Bạn chắc chắn ${selectedPersonForDetail.name} chính là người thân mà bạn đang tìm kiếm?`,
                        type: 'success',
                        onConfirm: () => handleConfirm(selectedPersonForDetail.personId)
                      });
                    }}
                    className="flex-1 py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-navy/90 transition-all shadow-lg"
                  >
                    Đây là người thân tôi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Custom Confirmation Dialog */}
        {customConfirm.show && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 text-center">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${customConfirm.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {customConfirm.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
              </div>
              <h4 className="text-2xl font-bold text-navy mb-3">{customConfirm.title}</h4>
              <p className="text-slate-600 mb-8 leading-relaxed font-medium">
                {customConfirm.message}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setCustomConfirm(prev => ({ ...prev, show: false }))}
                  className="flex-1 py-3 px-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Xem lại
                </button>
                <button 
                  onClick={customConfirm.onConfirm}
                  className={`flex-1 py-3 px-4 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${customConfirm.type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-navy hover:bg-navy/90 shadow-navy/20'}`}
                >
                  Xác nhận ngay
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
