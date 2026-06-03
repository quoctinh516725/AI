"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, PlusCircle, LogOut } from "lucide-react";

const LighthouseIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 9h8" />
    <path d="M9 4h6" />
    <path d="m11 4-1-2h4l-1 2" />
    <path d="m9 9-2 13" />
    <path d="m15 9 2 13" />
    <path d="M14 22H10" />
    <path d="M7 13h10" />
    <path d="M6 17h12" />
    <path d="M3 22h18" />
    <circle cx="12" cy="6.5" r="1.5" className="fill-gold stroke-none animate-pulse" />
  </svg>
);

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra token trong localStorage
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user data", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-background/90 backdrop-blur-md dark:border-gray-800/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white shadow-md transition-transform group-hover:scale-105">
            <LighthouseIcon size={22} />
          </div>
          <span className="font-heading text-2xl font-bold text-navy tracking-tight dark:text-white">
            Beacons
          </span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-semibold text-gray-700 dark:text-gray-300">
          <Link href="/" className="hover:text-gold transition-colors">
            Trang chủ
          </Link>
          <Link href="/posts" className="hover:text-gold transition-colors">
            Bài đăng
          </Link>
          <Link href="/blog" className="hover:text-gold transition-colors">
            Thông tin
          </Link>
          <Link href="/about" className="hover:text-gold transition-colors">
            Về Chúng Tôi
          </Link>
          <Link href="/contact" className="hover:text-gold transition-colors">
            Liên Hệ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Nút Đăng tin */}
              <Link 
                href="/create" 
                className="hidden sm:flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-navy shadow-sm hover:bg-yellow-400 transition-all"
              >
                <PlusCircle size={18} />
                Đăng tin
              </Link>
              
              {/* User Dropdown Menu */}
              <div className="relative group">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-navy hover:bg-slate-200 transition-all overflow-hidden"
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </button>

                {/* Dropdown Content */}
                <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-xl border border-slate-100 ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownOpen ? 'block animate-in fade-in zoom-in-95' : 'hidden'} duration-200 z-[60]`}>
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-sm font-bold text-navy truncate">{user?.username || "Người dùng"}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email || "user@example.com"}</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy rounded-xl transition-colors"
                  >
                    <User size={16} className="text-slate-400" />
                    Hồ sơ của tôi
                  </Link>
                  
                  <Link 
                    href="/my-posts" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-navy rounded-xl transition-colors"
                  >
                    <PlusCircle size={16} className="text-slate-400" />
                    Bài đăng của tôi
                  </Link>

                  <div className="h-px bg-slate-100 my-1"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="hidden sm:block text-sm font-bold text-navy hover:text-gold transition-colors dark:text-white"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="rounded-full bg-navy px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-navy/90 transition-all dark:bg-gold dark:text-navy dark:hover:bg-gold/90"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
