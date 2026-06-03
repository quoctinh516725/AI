import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface BlogProps {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
}

export default function BlogCard({ blog }: { blog: BlogProps }) {
  return (
    <Link href={`/blog/${blog.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 text-xs font-semibold text-blue-600">{blog.date}</span>
        <h3 className="mb-2 font-sans text-lg font-bold text-slate-800 line-clamp-2 group-hover:text-blue-700 transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-3 mb-4">
          {blog.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-1 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
          Đọc tiếp <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
