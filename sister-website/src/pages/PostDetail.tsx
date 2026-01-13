import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        } else {
          console.error("找不到該文章 ID");
        }
      } catch (error) {
        console.error("獲取文章出錯:", error);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div className="pt-40 text-center font-serif italic text-neutral-400">Loading...</div>;
  if (!post) return <div className="pt-40 text-center text-secondary font-serif">Oops! 文章好像弄丟了。</div>;

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="pt-32 pb-20 px-6 max-w-3xl mx-auto"
    >
      <header className="mb-16 text-center">
        <span className="text-[10px] tracking-[0.4em] text-primary font-bold uppercase mb-4 block">
          {post.category || 'Lifestyle'}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary leading-tight mb-8">
          {post.title}
        </h1>
        <div className="w-16 h-[1px] bg-primary/30 mx-auto mb-8"></div>
        <p className="text-neutral-400 text-[10px] tracking-[0.2em] uppercase font-light">
          {post.createdAt ? `Published on ${post.createdAt.toDate().toLocaleDateString()}` : "Just Published"}
        </p>
      </header>

      <div className="prose prose-stone prose-lg max-w-none">
        {post.content?.blocks?.map((block: any) => {
          switch (block.type) {
            case 'header':
              // 💡 修正點：將 Tag 定義為 React.ElementType
              const HeaderTag = `h${block.data.level || 2}` as React.ElementType;
              return (
                <HeaderTag key={block.id} className="font-serif text-secondary mt-12 mb-6">
                   {block.data.text}
                </HeaderTag>
              );
            
            case 'paragraph':
              return (
                <p 
                  key={block.id} 
                  className="text-secondary/80 leading-relaxed mb-8" 
                  dangerouslySetInnerHTML={{ __html: block.data.text }} 
                />
              );
            
            case 'list':
              const ListTag = block.data.style === 'ordered' ? 'ol' : ('ul' as React.ElementType);
              return (
                <ListTag key={block.id} className={`list-inside space-y-3 mb-8 ${block.data.style === 'ordered' ? 'list-decimal' : 'list-disc'}`}>
                  {block.data.items.map((item: string, i: number) => (
                    <li key={i} className="text-secondary/80" dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ListTag>
              );
            
            case 'image':
              return (
                <figure key={block.id} className="my-12">
                  <div className="overflow-hidden rounded-3xl shadow-sm bg-neutral-50">
                    <img 
                      src={block.data.file?.url} 
                      alt={block.data.caption || ""} 
                      className="w-full hover:scale-105 transition-transform duration-1000" 
                    />
                  </div>
                  {block.data.caption && (
                    <figcaption className="text-center text-[11px] text-neutral-400 mt-5 italic tracking-wide">
                      {block.data.caption}
                    </figcaption>
                  )}
                </figure>
              );
            
            default:
              return null;
          }
        })}
      </div>
    </motion.article>
  );
};

export default PostDetail;