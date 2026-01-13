import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, addDoc } from 'firebase/firestore';

const AdSettings = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [editingAd, setEditingAd] = useState<any>(null);

  useEffect(() => {
    // 💡 監聽所有廣告集合
    const unsubscribe = onSnapshot(collection(db, "ads"), (snapshot) => {
      setAds(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const saveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAd.id) {
        await setDoc(doc(db, "ads", editingAd.id), editingAd);
      } else {
        await addDoc(collection(db, "ads"), editingAd);
      }
      setEditingAd(null);
    } catch (err) {
      console.error("儲存廣告失敗，請檢查規則設定:", err);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-serif text-secondary italic">廣告版位管理</h2>
        <button 
          onClick={() => setEditingAd({ title: '', imageUrl: '', link: '', position: 'post_middle', isActive: true })}
          className="bg-primary text-white px-6 py-2 rounded-full text-xs tracking-widest hover:bg-secondary transition-colors"
        >
          + 新增廣告
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {ads.map(ad => (
          <div key={ad.id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center justify-between border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              {/* 💡 修正：只有在有 URL 時才渲染 img，避免 Console 報錯 */}
              {ad.imageUrl ? (
                <img src={ad.imageUrl} className="w-16 h-16 object-cover rounded-lg bg-neutral-100" alt="" />
              ) : (
                <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center text-[10px] text-neutral-400 font-serif">No Pic</div>
              )}
              <div>
                <h4 className="font-bold text-secondary">{ad.title || "未命名廣告"}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 bg-neutral-100 text-neutral-500 rounded uppercase tracking-tighter">
                    {ad.position === 'post_middle' ? '文章內插' : ad.position === 'index_middle' ? '首頁中間' : '側欄廣告'}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${ad.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-400'}`}>
                    {ad.isActive ? '投放中' : '已停止'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setEditingAd(ad)} className="text-xs text-secondary hover:text-primary underline underline-offset-4">編輯</button>
              <button onClick={() => { if(window.confirm('確定刪除？')) deleteDoc(doc(db, "ads", ad.id)) }} className="text-xs text-red-300 hover:text-red-500 underline underline-offset-4">刪除</button>
            </div>
          </div>
        ))}
      </div>

      {/* 編輯彈窗 (維持妳原本的優雅設計) */}
      {editingAd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <form onSubmit={saveAd} className="bg-white p-8 rounded-[2rem] w-full max-w-md shadow-2xl space-y-5">
            <h3 className="font-serif text-2xl text-secondary mb-2 italic">編輯廣告資訊</h3>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] text-neutral-400 tracking-widest uppercase">廣告標題</label>
                <input required className="w-full border-b border-neutral-200 py-2 outline-none focus:border-primary transition-colors" value={editingAd.title} onChange={e => setEditingAd({...editingAd, title: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 tracking-widest uppercase">圖片網址 (Cloudinary/Imgur)</label>
                <input required className="w-full border-b border-neutral-200 py-2 outline-none focus:border-primary transition-colors" value={editingAd.imageUrl} onChange={e => setEditingAd({...editingAd, imageUrl: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 tracking-widest uppercase">跳轉連結</label>
                <input required className="w-full border-b border-neutral-200 py-2 outline-none focus:border-primary transition-colors" value={editingAd.link} onChange={e => setEditingAd({...editingAd, link: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 tracking-widest uppercase block mb-2">投放位置</label>
                <select className="w-full border border-neutral-100 rounded-lg p-2 text-sm text-secondary outline-none focus:ring-1 focus:ring-primary" value={editingAd.position} onChange={e => setEditingAd({...editingAd, position: e.target.value})}>
                  <option value="index_middle">首頁中間區</option>
                  <option value="post_middle">文章內插</option>
                  <option value="sidebar">側欄廣告</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActive" checked={editingAd.isActive} onChange={e => setEditingAd({...editingAd, isActive: e.target.checked})} className="accent-primary" />
                <label htmlFor="isActive" className="text-sm text-secondary">啟用廣告投放</label>
              </div>
            </div>
            <div className="flex justify-end gap-6 mt-8">
              <button type="button" onClick={() => setEditingAd(null)} className="text-xs text-neutral-400 tracking-widest uppercase">Cancel</button>
              <button type="submit" className="bg-secondary text-white px-10 py-3 rounded-full text-xs tracking-[0.2em] uppercase hover:bg-primary transition-colors">Save Ad</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default AdSettings;