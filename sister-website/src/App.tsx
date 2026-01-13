import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Taipei from './pages/Taipei';
import NewTaipei from './pages/NewTaipei';
import Taichung from './pages/Taichung';
import AdOverlay from './components/AdOverlay/AdOverlay';
import PostDetail from './pages/PostDetail';
import Footer from './components/Footer/Footer';

// 後台相關組件
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import Editor from './pages/Admin/Editor';
import PostList from './pages/Admin/PostList';

// src/App.tsx
export default function App() {
  return (
    <Router>
      <Routes>
        {/* 前台路徑 */}
        <Route path="/*" element={
          <>
            <Navbar />
            <AdOverlay />
            <div className="pt-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                {/* ✅ 修正：前台路徑應該要對應到 PostDetail (內文頁) */}
                <Route path="/post/:id" element={<PostDetail />} />
                <Route path="/taipei" element={<Taipei />} />
                <Route path="/newTaipei" element={<NewTaipei />} />
                <Route path="/taichung" element={<Taichung />} />
              </Routes>
            </div>
            <Footer />
          </>
        } />

        {/* 後台路徑 */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="edit" element={<Editor />} />        {/* 用於新增 */}
          <Route path="edit/:id" element={<Editor />} />    {/* 用於編輯 */}
          {/* ✅ 修正：後台管理頁面的「文章」路徑應該對應到 PostList (列表頁) */}
          <Route path="posts" element={<PostList />} /> 
          {/* 如果需要在後台預覽，可以再加一行如下： */}
          <Route path="posts/:id" element={<PostDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}