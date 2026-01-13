import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy,} from 'firebase/firestore';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const DashboardHome: React.FC = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [albumCount, setAlbumCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0); // 💡 新增：留言總數
  const [recentMsgs, setRecentMsgs] = useState<any[]>([]); // 💡 新增：最新留言列表s
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    // 1. 監聽文章與流量
    const unsubPosts = onSnapshot(collection(db, "posts"), (snapshot) => {
      let views = 0;
      const data = snapshot.docs.map(doc => {
        const post = doc.data();
        views += (post.views || 0);
        return { 
          name: post.title ? (post.title.length > 5 ? post.title.substring(0, 5) + '..' : post.title) : 'Untitled', 
          views: post.views || 0 
        };
      });
      setTotalViews(views);
      setChartData(data.sort((a, b) => b.views - a.views).slice(0, 7));
    });

    // 2. 監聽相簿總數
    const unsubAlbum = onSnapshot(collection(db, "album"), (snap) => setAlbumCount(snap.size));

    // 3. 💡 實質功能：監聽最新留言 (取最近 3 則)
    const msgQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMsgs = onSnapshot(msgQuery, (snap) => {
      setMsgCount(snap.size);
      const msgs = snap.docs.slice(0, 3).map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'
      }));
      setRecentMsgs(msgs);
    });

    return () => { unsubPosts(); unsubAlbum(); unsubMsgs(); };
  }, []);

  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-1000">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-secondary italic tracking-tight">Content Intelligence</h2>
          <p className="text-[10px] text-neutral-400 uppercase tracking-[0.3em] mt-2 font-bold">歡迎回來，雞不擇食管理員</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 bg-green-50 px-4 py-1.5 rounded-full border border-green-100 shadow-sm animate-pulse">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> LIVE MONITORING
        </span>
      </header>

      {/* 數據卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: '總瀏覽人次', value: totalViews.toLocaleString(), color: 'text-primary', sub: 'Total Page Views' },
          { label: '雲端相簿資產', value: albumCount, color: 'text-secondary', sub: 'Cloudinary Images' },
          { label: '待處理留言', value: msgCount, color: 'text-orange-600', sub: 'Unread Inquiries' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <p className="text-[10px] text-neutral-400 tracking-[0.2em] uppercase font-bold mb-4">{item.label}</p>
            <h3 className={`text-5xl font-serif mb-2 ${item.color}`}>{item.value}</h3>
            <p className="text-[10px] text-neutral-300 italic tracking-wide">{item.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左側：流量圖表 */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-neutral-100 shadow-sm">
          <h4 className="text-xl font-serif text-secondary italic mb-10">熱門內容趨勢</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f4a261" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f4a261" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#888'}} dy={15} />
                <Tooltip />
                <Area type="monotone" dataKey="views" stroke="#f4a261" strokeWidth={4} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 💡 右側：最新留言即時通知區 (視覺優化) */}
        <div className="bg-secondary p-10 rounded-[3.5rem] text-white shadow-2xl flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-sm font-serif italic opacity-80 uppercase tracking-widest">Recent Inquiries</h4>
            <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full">LIVE</span>
          </div>
          
          <div className="flex-1 space-y-6">
            {recentMsgs.length > 0 ? recentMsgs.map((msg) => (
              <div key={msg.id} className="border-b border-white/10 pb-4 group cursor-pointer hover:bg-white/5 transition-colors p-2 rounded-xl">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-bold text-primary tracking-wide">{msg.name}</p>
                  <span className="text-[9px] opacity-40">{msg.time}</span>
                </div>
                <p className="text-[11px] opacity-70 line-clamp-2 leading-relaxed italic">
                  "{msg.message}"
                </p>
              </div>
            )) : (
              <p className="text-xs opacity-40 italic py-10 text-center">目前尚無新留言</p>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-white/10">
            <p className="text-2xl font-serif italic mb-2">掌握每一個機會</p>
            <p className="text-[10px] opacity-50 tracking-widest uppercase">Keep Growing Your Brand.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;