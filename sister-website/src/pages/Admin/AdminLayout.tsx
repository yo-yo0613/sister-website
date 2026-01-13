import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { title: '數據總覽', path: '/admin', icon: '📊' },
    { title: '寫文章', path: '/admin/edit', icon: '✍️' },
    { title: '我的文章', path: '/admin/posts', icon: '📝' },
    { title: '相簿管理', path: '/admin/album', icon: '🖼️' },
    { title: '廣告設定', path: '/admin/ads', icon: '📢' },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafaf9] font-sans">
      {/* 💡 手機版頂部導覽條 (Mobile Header) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-50">
        <div className="font-serif text-lg font-bold text-secondary">
          雞不<span className="text-primary">擇食</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-secondary focus:outline-none"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 💡 手機版側欄遮罩 (Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* 💡 側邊導覽列 (Responsive Sidebar) */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-50
        transition-transform duration-500 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="font-serif text-2xl font-bold text-secondary tracking-tight">
            雞不<span className="text-primary">擇食</span>
          </div>
          <p className="text-[10px] text-neutral-300 uppercase tracking-widest hidden md:block">Admin</p>
        </div>
        
        <nav className="flex-1 p-6 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                <motion.div 
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center px-5 py-4 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-primary/5 text-primary font-bold shadow-sm shadow-primary/10' 
                      : 'text-neutral-400 hover:bg-neutral-50 hover:text-secondary'}
                  `}
                >
                  <span className={`mr-4 text-xl ${isActive ? 'grayscale-0' : 'grayscale'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.title}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" 
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-50">
          <Link to="/" className="text-[10px] text-neutral-400 hover:text-primary uppercase tracking-[0.2em] transition-colors">
            ← Back to Website
          </Link>
        </div>
      </aside>

      {/* 💡 右側內容區 (Main Content) */}
      <main className="flex-1 min-w-0 pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-12">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main> 
    </div>
  );
};

export default AdminLayout;