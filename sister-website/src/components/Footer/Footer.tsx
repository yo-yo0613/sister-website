import React from 'react';
import { Link } from 'react-router-dom';
//import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary border-t border-primary-light/30 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          
          {/* 左側：關於我們 */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-secondary italic tracking-wider">
              雞不 <span className="text-neutral-100">擇食</span>
            </h3>
            <p className="text-neutral-50 text-sm leading-relaxed tracking-wide">
              穿梭在台北與世界各地的巷弄，<br />
              用鏡頭與文字紀錄每一份最真實的味蕾感動。<br />
              二姊的時尚食記，與妳分享生活的美好。
            </p>
          </div>

          {/* 中間：快速連結 */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">Explore</h4>
            <nav className="flex flex-col space-y-4">
              {['首頁', '出國旅遊', '新北', '台北', '台中'].map((item) => (
                <Link 
                  key={item} 
                  to={item === '首頁' ? '/' : item === '出國旅遊' ? '/about' : `/${item === '新北' ? 'NewTaipei' : item === '台北' ? 'Taipei' : 'Taichung'}`}
                  className="text-secondary-dark hover:text-secondary text-sm transition-colors duration-300 tracking-widest"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* 右側：社群與聯絡 */}
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-secondary">Connect</h4>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/xun.g_foodie/" target="_blank" rel="noreferrer" className="text-secondary-dark hover:text-secondary transition-colors italic font-serif">Instagram</a>
              <a href="mailto:xungfoodie@gmail.com" className="text-secondary-dark hover:text-secondary transition-colors italic font-serif">Email</a>
            </div>
            <div className="pt-4">
               <div className="bg-primary/5 p-4 rounded-2xl border border-primary-light">
                 <p className="text-[10px] text-secondary font-medium leading-relaxed uppercase tracking-tighter">
                   Business inquiries:<br/>
                   xungfoodie@gmail.com
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* 底部版權 */}
        <div className="pt-10 border-t border-primary-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-neutral-50 tracking-widest uppercase">
            © 2026 Sister Studio. All rights reserved.
          </p>
          <div className="flex space-x-8 text-[10px] text-neutral-50 tracking-widest uppercase">
            <span className="cursor-pointer hover:text-neutral-300 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-neutral-300 transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;