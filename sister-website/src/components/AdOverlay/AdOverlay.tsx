import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdOverlay: React.FC = () => {
  const [show, setShow] = useState(false);
  const [adConfig, setAdConfig] = useState({ img: '', link: '', active: false });

  // 模擬從 Firebase 抓取二姊設定的廣告內容
  useEffect(() => {
    // 假設抓到的資料如下
    const mockDataFromFirebase = {
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', // 範例圖
      link: '/services',
      active: true
    };
    
    if (mockDataFromFirebase.active) {
      setAdConfig(mockDataFromFirebase);
      // 延遲 2 秒後跳出，比較專業，不會一進來就擋住人
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* 背景遮罩 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShow(false)}
            className="absolute inset-0 bg-secondary/60 backdrop-blur-sm"
          />

          {/* 廣告內容視窗 */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white p-7 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden mt-5"
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-1 right-4 text-neutral hover:text-neutral-700 transition-colors z-10"
            >
              ✕ 關閉
            </button>
            
            <a href={adConfig.link}>
              <img src={adConfig.img} alt="特別活動" className="w-full h-auto rounded" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-serif text-secondary tracking-widest">最新活動標題</h3>
                <p className="text-neutral-400 mt-2">點擊查看更多細節</p>
              </div>
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdOverlay;