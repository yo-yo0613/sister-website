import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// 組件引入
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PreLoader from './components/PreLoader/PreLoader'; // 💡 新增載入動畫

// 頁面引入
import Home from './pages/Home';
import Travel from './pages/Travel';
import Taipei from './pages/Taipei';
import NewTaipei from './pages/NewTaipei';
import Taichung from './pages/Taichung';
import ContactMe from './pages/ContactMe';
import PostDetail from './pages/PostDetail';

// 後台相關
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import Editor from './pages/Admin/Editor';
import PostList from './pages/Admin/PostList';
import AdSettings from './pages/Admin/AdSettings';
import AblumManager from './pages/Admin/AblumManager';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 💡 模擬初始化載入時間
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200); // 配合 PreLoader 的 1.5s delay + 0.8s transition
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {/* 💡 1. 品牌載入動畫 */}
      <AnimatePresence mode="wait">
        {loading && <PreLoader key="loader" />}
      </AnimatePresence>

      {/* 💡 2. 主要內容 (只有在非加載狀態下渲染，避免背景閃爍) */}
      {!loading && (
        <Routes>
          {/* 前台路徑 */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow pt-24">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/travel" element={<Travel />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  <Route path="/taipei" element={<Taipei />} />
                  <Route path="/newTaipei" element={<NewTaipei />} />
                  <Route path="/taichung" element={<Taichung />} />
                  <Route path="/contact" element={<ContactMe />} />
                </Routes>
              </div>
              <Footer />
            </div>
          } />

          {/* 後台路徑 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="ads" element={<AdSettings />} />
            <Route path="edit" element={<Editor />} />
            <Route path="edit/:id" element={<Editor />} />
            <Route path="posts" element={<PostList />} />
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="album" element={<AblumManager />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}