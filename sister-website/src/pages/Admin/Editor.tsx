import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 新增
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 取得網址 ID
  const navigate = useNavigate();
  const editorRef = useRef<EditorJS | null>(null);
  
  // 狀態管理
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Taipei'); // 預設台北
  const [status, setStatus] = useState('published'); // 預設公開
  const [isEditMode, setIsEditMode] = useState(false);

  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dt1ridsu5/image/upload";
  const UPLOAD_PRESET = "sister_preset";

  // 初始化或編輯讀取
  useEffect(() => {
    const initEditor = (initialData?: any) => {
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: 'editorjs-container',
          data: initialData || {}, // 如果是編輯模式，填入舊資料
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
          initEditor(data.content); // 傳入舊內容
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
    if (!editorRef.current) return;
    try {
      const savedData = await editorRef.current.save();
      if (!title.trim()) return alert("請輸入標題");

      const postData = {
        title: title,
        content: savedData,
        category: category,
        status: status,
        updatedAt: serverTimestamp(),
      };

      if (isEditMode && id) {
        // 編輯模式：更新現有文件
        await updateDoc(doc(db, "posts", id), postData);
        alert("✨ 文章更新成功！");
      } else {
        // 新增模式
        await addDoc(collection(db, "posts"), {
          ...postData,
          createdAt: serverTimestamp(),
          author: "二姊",
        });
        alert("🎉 文章發布成功！");
      }
      navigate('/admin/posts'); // 跳轉回列表
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-neutral-100">
        {/* 下拉選單區域 */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 ml-1">分類</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="bg-neutral-50 border-none rounded-xl text-sm font-bold text-secondary focus:ring-primary"
            >
              <option value="NewTaipei">新北</option>
              <option value="Taipei">台北</option>
              <option value="Taichung">台中</option>
              <option value="Travel">出國旅遊</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-neutral-400 ml-1">狀態</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="bg-neutral-50 border-none rounded-xl text-sm font-bold text-secondary focus:ring-primary"
            >
              <option value="published">公開發布</option>
              <option value="draft">隱藏/草稿</option>
            </select>
          </div>
        </div>

        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="在此輸入吸引人的標題" 
          className="w-full text-4xl font-serif font-bold text-secondary border-none focus:ring-0 p-0 mb-8 bg-transparent"
        />
        <div id="editorjs-container" className="prose prose-stone max-w-none min-h-[500px]"></div>
      </div>

      <div className="flex justify-end gap-6 items-center pr-4">
        <button 
          onClick={handlePublish}
          className="px-10 py-4 bg-secondary text-white rounded-full hover:bg-primary transition-all shadow-lg text-xs font-bold uppercase"
        >
          {isEditMode ? 'Update Article' : 'Publish Now'}
        </button>
      </div>
    </div>
  );
};

export default Editor;