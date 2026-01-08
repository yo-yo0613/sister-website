import React, { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';

// 引入 Firebase 實例
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Editor: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState(''); // 管理文章標題狀態

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: 'editorjs-container',
        tools: {
          header: { class: Header, inlineToolbar: true },
          paragraph: { class: Paragraph, inlineToolbar: true },
          list: { class: List, inlineToolbar: true },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                // 重寫上傳功能
                async uploadByFile(file: File) {
                  try {
                    // 1. 定義在 Storage 中的儲存路徑
                    const storageRef = ref(storage, `posts/${Date.now()}_${file.name}`);
                    // 2. 上傳原始檔案
                    const snapshot = await uploadBytes(storageRef, file);
                    // 3. 取得可讀取的圖片 URL
                    const downloadURL = await getDownloadURL(snapshot.ref);

                    return {
                      success: 1,
                      file: { url: downloadURL }
                    };
                  } catch (error) {
                    console.error("Firebase 上傳錯誤:", error);
                    return { success: 0 };
                  }
                }
              }
            }
          }
        },
        placeholder: '點擊此處，開始撰寫妳的時尚故事...',
        onChange: async () => {
          // 你可以在這裡做自動存檔草稿的邏輯
        }
      });
      editorRef.current = editor;
    }

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // 實作「發布文章」功能
  const handlePublish = async () => {
    if (!editorRef.current) return;

    try {
      const savedData = await editorRef.current.save();
      
      // 將資料存入 Firestore
      const docRef = await addDoc(collection(db, "posts"), {
        title: title,
        content: savedData, // Editor.js 的 JSON 結構
        createdAt: serverTimestamp(),
        author: "二姊"
      });

      alert("文章發布成功！ID: " + docRef.id);
    } catch (error) {
      console.error("發布失敗:", error);
      alert("發布失敗，請檢查網路或權限");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10">
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-neutral-100">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="在此輸入吸引人的標題" 
          className="w-full text-5xl font-serif font-bold text-secondary placeholder:text-neutral-200 border-none focus:ring-0 p-0 mb-6"
        />
        <div className="h-[1px] bg-neutral-100 w-full mb-10" />
        <div id="editorjs-container" className="prose prose-orange max-w-none min-h-[400px]"></div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-8 py-3 text-neutral-400 hover:text-secondary transition-colors tracking-widest text-sm font-medium">
          存為草稿
        </button>
        <button 
          onClick={handlePublish}
          className="px-10 py-3 bg-secondary text-white rounded-full hover:bg-primary transition-all shadow-lg tracking-[0.2em] text-sm font-bold"
        >
          發布文章
        </button>
      </div>
    </div>
  );
};

export default Editor;