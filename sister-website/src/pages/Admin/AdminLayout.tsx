import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLayout: React.FC = () => {
  const menuItems = [
    { title: '數據總覽', path: '/admin', icon: '📊' },
    { title: '寫文章', path: '/admin/edit', icon: '✍️' },
    { title: '我的文章', path: '/admin/posts', icon: '📝' },
    { title: '相簿管理', path: '/admin/album', icon: '🖼️' },
    { title: '廣告設定', path: '/admin/ads', icon: '📢' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* 側邊導覽列 */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 font-serif text-xl font-bold text-secondary">
          雞不 <span className="text-primary">擇食 </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <motion.div 
                whileHover={{ x: 5, backgroundColor: '#fdf3e7' }}
                className="flex items-center px-4 py-3 text-secondary-light rounded-lg hover:text-primary transition-colors"
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </motion.div>
            </Link>
          ))}
        </nav>
      </aside>

      {/* 右側內容區 */}
      <main className="flex-1 overflow-y-auto p-10">
        <motion.div
            key={location.pathname} // 需要引入 useLocation
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Outlet />
        </motion.div>
        </main>
    </div>
  );
};

export default AdminLayout;