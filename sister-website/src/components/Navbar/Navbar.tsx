import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 導覽選項：對應你的頁面路徑
  const navLinks = [
    { title: '首頁', href: '/' },
    { title: '出國旅遊', href: '/travel' },
    { title: '新北', href: '/newTaipei' },
    { title: '台北', href: '/taipei' },
    { title: '台中', href: '/taichung' },
    { title: '關於雞不擇食', href: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-primary backdrop-blur-md border-b border-primary-dark/20">
      <div className="max-w-7xl mx-auto px-8 h-24 flex justify-between items-center">
        
        {/* LOGO：使用 serif 字體增加高級感 */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl font-serif font-medium tracking-widest text-white"
        >
          <Link to="/">雞不 <span className="text-primary-light">擇食</span></Link>
        </motion.div>

        {/* 桌面版選單 */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            >
              <Link
                to={link.href}
                className={`relative text-sm tracking-[0.15em] transition-colors duration-500 group ${
                  location.pathname === link.href ? 'text-white font-bold' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.title}
                {/* 底部裝飾線條 */}
                <span className={`absolute -bottom-2 left-0 h-[1px] bg-white transition-all duration-500 ${
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* 行動裝置漢堡選單按鈕 */}
        <div className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <button className="text-secondary p-2">
            <div className="space-y-2">
              <motion.span 
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 10 : 0 }}
                className="block w-6 h-[1px] bg-current" 
              />
              <motion.span 
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="block w-6 h-[1px] bg-current" 
              />
              <motion.span 
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -10 : 0 }}
                className="block w-6 h-[1px] bg-current" 
              />
            </div>
          </button>
        </div>
      </div>

      {/* 行動版選單展開動畫 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute top-24 left-0 w-full bg-white border-b border-neutral-100 md:hidden"
          >
            <div className="px-10 py-12 flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.title} 
                  to={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-lg tracking-widest text-secondary hover:text-primary-dark transition-colors"
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;