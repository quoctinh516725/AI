"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Trash2, Edit, AlertCircle, PlusCircle, Eye, CheckCircle2, FileText } from "lucide-react";
import Image from "next/image";

export default function MyPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [similarPersons, setSimilarPersons] = useState<any[]>([]);
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPersonForDetail, setSelectedPersonForDetail] = useState<any>(null);
  const [customConfirm, setCustomConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm?: () => void;
    type: 'success' | 'warning' | 'error';
    isAlert?: boolean;
  }>({
    show: false,
    title: "",
    message: "",
    type: 'warning'
  });

  const showNotification = (title: string, message: string, type: 'success' | 'warning' | 'error' = 'warning') => {
    setCustomConfirm({
      show: true,
      title,
      message,
      type,
      isAlert: true
    });
  };

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/me?page=1&limit=50`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Không thể tải danh sách bài đăng.");
      }

      setPosts(result.data.data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDelete = (postId: string) => {
    setCustomConfirm({
      show: true,
      title: "Xóa bài đăng",
      message: "Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.",
      type: 'warning',
      onConfirm: () => executeDelete(postId)
    });
  };

  const executeDelete = async (postId: string) => {
    setCustomConfirm(prev => ({ ...prev, show: false }));
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Xóa thất bại.");
      }

      setPosts(posts.filter(p => p.id !== postId));
      // Optional success feedback without blocking
    } catch (err: any) {
      showNotification("Lỗi xoá bài", err.message, "error");
    }
  };

  const handleResumeConfirm = async (postId: string) => {
    try {
      setIsSubmitting(true);
      setPendingPostId(postId);
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/similar`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Lỗi tải dữ liệu");

      setSimilarPersons(result.data);
      setShowConfirmModal(true);
    } catch (error: any) {
      showNotification("Lỗi tải dữ liệu", error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirm = async (selectedPersonId: string | null) => {
    if (!pendingPostId) return;
    
    setCustomConfirm(prev => ({ ...prev, show: false }));
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${pendingPostId}/confirm`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personId: selectedPersonId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Xác nhận thất bại");
      }

      setShowConfirmModal(false);
      showNotification("Xác nhận thành công", "Xác nhận hồ sơ thành công! Dữ liệu của bạn đã được liên kết trên hệ thống.", "success");
      fetchMyPosts(); // Refresh list

    } catch (err: any) {
      showNotification("Lỗi xác nhận", err.message || "Lỗi xác nhận", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "CONFIRMED") return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">Đã Xác Nhận</span>;
    if (status === "FOUND") return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Đã Tìm Thấy</span>;
    if (status === "PENDING") return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Chờ xác nhận</span>;
    return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
  };

  const defaultImage = "https://images.unsplash.com/photo-1544717301-9cdcb1f5940f?w=800&auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-[#F4F7FB] py-12 px-4">
      {/* Container My Posts */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-navy">Bài Đăng Của Tôi</h1>
          <Link 
            href="/create" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
          >
            <PlusCircle size={18} /> Đăng tin mới
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-2">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
              <p className="text-slate-500">Đang tải dữ liệu...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Chưa có bài đăng nào</h3>
              <p className="text-slate-500 mb-6">Bạn chưa tạo hồ sơ tìm kiếm nào trên hệ thống.</p>
              <Link 
                href="/create" 
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Tạo bài đăng đầu tiên
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-sm">
                    <th className="p-4 font-semibold w-16">Ảnh</th>
                    <th className="p-4 font-semibold">Tên hồ sơ</th>
                    <th className="p-4 font-semibold">Trạng thái</th>
                    <th className="p-4 font-semibold">Ngày tạo</th>
                    <th className="p-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100">
                          <img 
                            src={post.image_url || defaultImage} 
                            alt={post.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{post.name}</p>
                        <p className="text-xs text-slate-500">{post.location}</p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {post.status === "PENDING" ? (
                          <button
                            onClick={() => handleResumeConfirm(post.id)}
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center bg-gold text-navy font-bold px-4 py-2 rounded-xl hover:bg-yellow-400 transition-colors shadow-sm text-sm disabled:opacity-50"
                          >
                            {isSubmitting && pendingPostId === post.id ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                            Xác nhận ngay
                          </button>
                        ) : (
                          <>
                            <Link 
                              href={`/post/${post.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </Link>
                            <Link 
                              href={`/edit-post/${post.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </Link>
                            <button 
                              onClick={() => handleDelete(post.id)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

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

              {similarPersons.length === 0 ? (
                 <div className="text-center py-10">
                   <p className="text-slate-500 font-medium">Không tìm thấy dữ liệu người giống trong lần quét này.</p>
                 </div>
              ) : (
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
              )}
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
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${customConfirm.type === 'success' ? 'bg-green-100 text-green-600' : customConfirm.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
              {customConfirm.type === 'success' ? <CheckCircle2 size={32} /> : <AlertCircle size={32} />}
            </div>
            <h4 className="text-2xl font-bold text-navy mb-3">{customConfirm.title}</h4>
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              {customConfirm.message}
            </p>
            <div className="flex gap-3">
              {!customConfirm.isAlert && (
                <button 
                  onClick={() => setCustomConfirm(prev => ({ ...prev, show: false }))}
                  className="flex-1 py-3 px-4 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                  Xem lại
                </button>
              )}
              <button 
                onClick={customConfirm.isAlert ? () => setCustomConfirm(prev => ({ ...prev, show: false })) : customConfirm.onConfirm}
                className={`flex-1 py-3 px-4 text-sm font-bold text-white rounded-xl shadow-lg transition-all ${customConfirm.type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : customConfirm.type === 'error' ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-navy hover:bg-navy/90 shadow-navy/20'}`}
              >
                {customConfirm.isAlert ? "Đóng" : "Xác nhận ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
