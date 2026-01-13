import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Taipei');
  const [status, setStatus] = useState('published');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 💡 新增：SEO 相關狀態
  const [seoDesc, setSeoDesc] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [showSEO, setShowSEO] = useState(false); // 控制 SEO 選單展開

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt1ridsu5/image/upload";
  const UPLOAD_PRESET = "sister_preset";

  useEffect(() => {
    const initEditor = (initialData?: any) => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: 'editorjs-container',
          data: initialData || {},
          tools: {
            header: { class: Header, inlineToolbar: true },
            paragraph: { class: Paragraph, inlineToolbar: true },
            list: { class: List, inlineToolbar: true },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  async uploadByFile(file: File) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', UPLOAD_PRESET);
                    const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
                    const data = await res.json();
                    return { success: 1, file: { url: data.secure_url } };
                  }
                }
              }
            }
          },
          placeholder: '開始妳的時尚故事...',
        });
        editorRef.current = editor;
      }
    };

    const fetchPostData = async () => {
      if (id) {
        setIsEditMode(true);
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);
          setCategory(data.category || 'Taipei');
          setStatus(data.status || 'published');
          // 💡 讀取舊有的 SEO 資料
          setSeoDesc(data.seoDescription || '');
          setSeoKeywords(data.seoKeywords || '');
          initEditor(data.content);
        }
      } else {
        initEditor();
      }
    };

    fetchPostData();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [id]);

  const handlePublish = async () => {
    if (!editorRef.current || isSaving) return;
    setIsSaving(true);
    try {
      const savedData = await editorRef.current.save();
      if (!title.trim()) {
        setIsSaving(false);
        return alert("請輸入標題");
      }

      // 💡 實質功能：將 SEO 資料一併存入 Firebase
      const postData = {
        title: title,
        content: savedData,
        category: category,
        status: status,
        seoDescription: seoDesc,
        seoKeywords: seoKeywords,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && id) {
        await updateDoc(doc(db, "posts", id), postData);
      } else {
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: serverTimestamp(),
          author: "二姊",
          views: 0
        });
      }
      navigate('/admin/posts');
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 頂部固定動作條 */}
      <div className="sticky top-0 z-[60] bg-white/80 backdrop-blur-xl border-b border-neutral-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <button onClick={() => navigate('/admin/posts')} className="text-secondary opacity-40 hover:opacity-100 transition-opacity">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex gap-3">
           <button 
            onClick={handlePublish}
            disabled={isSaving}
            className="px-8 py-2.5 bg-secondary text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-secondary/20 active:scale-95 transition-all"
          >
            {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-8 space-y-8">
        {/* 分類與狀態 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold px-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-neutral-50 border-none rounded-2xl py-4 text-sm font-bold text-secondary focus:ring-primary/20">
              <option value="NewTaipei">新北美食</option>
              <option value="Taipei">台北美食</option>
              <option value="Taichung">台中美食</option>
              <option value="Travel">出國旅遊</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-400 font-bold px-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-neutral-50 border-none rounded-2xl py-4 text-sm font-bold text-secondary focus:ring-primary/20">
              <option value="published">公開發布</option>
              <option value="draft">設為草稿</option>
            </select>
          </div>
        </motion.div>

        {/* 💡 SEO 摺疊設定區 */}
        <div className="bg-neutral-50 rounded-[2rem] overflow-hidden border border-neutral-100">
          <button 
            onClick={() => setShowSEO(!showSEO)}
            className="w-full px-8 py-5 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-secondary hover:bg-neutral-100 transition-colors"
          >
            SEO Optimization {showSEO ? '↑' : '↓'}
          </button>
          
          <AnimatePresence>
            {showSEO && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-8 pb-8 space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Search Description (描述)</label>
                  <textarea 
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    placeholder="輸入網頁描述... (建議 150 字內，會顯示在 Google 搜尋結果)"
                    rows={3}
                    className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/10 resize-none font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] text-neutral-400 uppercase tracking-widest font-bold">Keywords (關鍵字)</label>
                  <input 
                    type="text" 
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="台北美食, 忠孝復興, 必吃牛排 (以逗號隔開)"
                    className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 標題輸入 */}
        <div className="border-b border-neutral-50 pb-8 pt-4">
          <textarea 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title..." 
            rows={1}
            className="w-full text-4xl md:text-5xl font-serif font-bold text-secondary border-none focus:ring-0 p-0 bg-transparent placeholder:text-neutral-100 resize-none overflow-hidden"
            onInput={(e: any) => {
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
          />
        </div>

        {/* 編輯器內容 */}
        <div className="pb-40">
          <div id="editorjs-container" className="prose prose-stone max-w-none min-h-[500px] prose-h2:font-serif prose-h2:italic prose-img:rounded-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Editor;