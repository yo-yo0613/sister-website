import React from 'react';
import { Link } from 'react-router-dom';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    category: string;
    createdAt?: any;
    content?: {
      blocks: any[];
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // 💡 安全地抓取圖片 URL 的邏輯
  const imageUrl = post.content?.blocks?.find((b: any) => b.type === 'image')?.data?.file?.url;

  // 💡 處理日期的邏輯
  const displayDate = post.createdAt?.toDate 
    ? post.createdAt.toDate().toLocaleDateString() 
    : "RECENT";

  return (
    <Link to={`/post/${post.id}`} className="group block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100/50">
        
        {/* 1. 顯示縮圖 (維持 4:3 比例) */}
        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt={post.title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-300 text-xs tracking-widest uppercase font-bold">
              No Image
            </div>
          )}
        </div>

        {/* 2. 顯示文字資訊 (間距與字體完全比照 About) */}
        <div className="p-6">
          <span className="text-[10px] tracking-[0.2em] text-primary font-bold uppercase mb-2 block">
            {post.category || 'Travel'}
          </span>
          <h3 className="text-xl font-serif font-bold text-secondary line-clamp-2 mb-4 h-[3.5rem] leading-snug">
            {post.title}
          </h3>
          <div className="flex justify-between items-center mt-2 border-t border-neutral-50 pt-4">
            <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
              {displayDate}
            </p>
            <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-bold tracking-tighter">
              READ MORE →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;