import React from 'react';
import { motion } from 'framer-motion';

const PostList: React.FC = () => {
  // 模擬從後端 (Spring Boot/Firebase) 抓取的文章數據
  const posts = [
    {
      id: 1,
      title: '新莊美食 | 綠豆沙霸主 古早味的最對味 買五送一可寄杯',
      date: '2023-04-06 10:22',
      views: 1205,
      status: '公開',
      adActive: true,
      image: 'https://images.unsplash.com/photo-1515003305869-8ba2117f244a'
    },
    {
      id: 2,
      title: '樹林美食 | 心目中第一名義料店 位在樹林車站附近',
      date: '2022-08-02 13:01',
      views: 842,
      status: '公開',
      adActive: false,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-secondary">我的文章</h2>
          <p className="text-sm text-gray-400 mt-1">在這裡瀏覽、編輯和管理文章</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-all shadow-sm">
          + 新增文章
        </button>
      </header>

      {/* 篩選列 */}
      <div className="flex gap-4 mb-6 text-sm text-gray-500 border-b border-gray-100 pb-4">
        <span className="text-primary font-bold border-b-2 border-primary pb-4 -mb-4 cursor-pointer">全部 ({posts.length})</span>
        <span className="hover:text-secondary cursor-pointer">已發布</span>
        <span className="hover:text-secondary cursor-pointer">草稿</span>
      </div>

      {/* 文章列表 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -2 }}
            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-6 items-center group"
          >
            {/* 文章縮圖 */}
            <div className="w-40 h-28 flex-shrink-0 overflow-hidden rounded-lg">
              <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="thumb" />
            </div>

            {/* 文章內容資訊 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">● {post.status}</span>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
              <h3 className="text-lg font-bold text-secondary line-clamp-1 hover:text-primary cursor-pointer transition-colors">
                {post.title}
              </h3>
              <div className="flex gap-6 mt-3 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-[10px] uppercase tracking-tighter">今日人氣</span>
                  <span className="font-bold text-primary">24</span>
                </div>
                <div className="flex flex-col border-l border-gray-100 pl-6">
                  <span className="text-gray-400 text-[10px] uppercase tracking-tighter">總人氣</span>
                  <span className="font-bold text-secondary">{post.views}</span>
                </div>
                {/* 廣告開關控制 */}
                <div className="flex flex-col border-l border-gray-100 pl-6">
                  <span className="text-gray-400 text-[10px] uppercase tracking-tighter">插頁廣告</span>
                  <div className={`mt-1 w-10 h-5 rounded-full relative cursor-pointer transition-colors ${post.adActive ? 'bg-primary' : 'bg-gray-200'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${post.adActive ? 'left-6' : 'left-1'}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex flex-col gap-2">
              <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">編輯</button>
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">刪除</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PostList;