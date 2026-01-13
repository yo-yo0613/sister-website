import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

const AlbumManager = () => {
  const [images, setImages] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // 💡 Cloudinary 資訊保持不變
  const CLOUD_NAME = "dt1ridsu5"; 
  const UPLOAD_PRESET = "sister_preset"; 

  useEffect(() => {
    // 💡 實時監聽相簿資料
    const unsubscribe = onSnapshot(collection(db, "album"), (snapshot) => {
      setImages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);

    try {
      for (const file of Array.from(e.target.files)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await response.json();

        if (data.secure_url) {
          await addDoc(collection(db, "album"), {
            url: data.secure_url,
            public_id: data.public_id,
            createdAt: serverTimestamp(),
            name: file.name
          });
        }
      }
      alert("✨ 照片批次上傳成功！");
    } catch (error) {
      console.error("Cloudinary 上傳失敗:", error);
      alert("上傳出錯，請檢查 Cloudinary 設定");
    }
    setUploading(false);
  };

  return (
    <div className="p-8 pb-20">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-serif text-secondary italic tracking-tight">相簿內容管理</h2>
          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.3em] mt-2 font-bold">Cloudinary Digital Assets</p>
        </div>
        <label className="cursor-pointer bg-secondary text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-widest hover:bg-primary transition-all shadow-lg uppercase">
          {uploading ? 'Uploading...' : '+ Upload Photos'}
          <input type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </header>

      {/* 💡 核心修改：後台管理也採用瀑布流佈局 */}
      <div className="columns-2 md:columns-4 lg:columns-6 gap-4 space-y-4">
        {images.map(img => (
          <div 
            key={img.id} 
            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm bg-neutral-50 transition-all duration-500 hover:shadow-xl"
          >
            {/* 💡 使用 h-auto 展現照片原始比例 */}
            <img 
              src={img.url} 
              className="w-full h-auto object-cover block" 
              alt={img.name || ""} 
              loading="lazy"
            />
            
            {/* 懸浮刪除控制層 */}
            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
              <p className="text-[9px] text-white/80 font-mono px-4 text-center truncate w-full">
                {img.name || 'Untitled'}
              </p>
              <button 
                onClick={() => { if(window.confirm('確定要刪除這張照片嗎？')) deleteDoc(doc(db, "album", img.id)) }}
                className="bg-white/20 border border-white/50 text-white text-[10px] tracking-widest px-6 py-2 rounded-full hover:bg-white hover:text-secondary transition-all uppercase"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumManager;