import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import AdOverlay from './components/AdOverlay/AdOverlay';

// 後台相關組件
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import Editor from './pages/Admin/Editor';
import PostList from './pages/Admin/PostList';

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
              </Routes>
            </div>
          </>
        } />

        {/* 後台路徑：嵌套路由 (Nested Routes) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="edit" element={<Editor />} />
          <Route path="posts" element={<PostList />} />
        </Route>
      </Routes>
    </Router>
  );
}