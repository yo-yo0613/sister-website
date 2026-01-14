import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 💡 修改：背景顏色改為妳定義的低飽和橘色 (primary-light)
    <footer className="bg-primary-light border-t border-primary/10 pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* 上層：品牌與大型導航 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* 左側：品牌標語 */}
          <div className="md:col-span-5 space-y-8">
            <h2 className="text-4xl font-serif font-bold italic text-secondary tracking-tighter">
              雞不 <span className="text-primary">擇食</span>
            </h2>
            {/* 💡 文字顏色調整為 secondary 以確保在橘色背景上的可讀性 */}
            <p className="text-secondary/70 text-sm leading-loose max-w-sm font-serif italic">
              "Life is too short for bad food and boring travels." <br />
              我們透過文字與鏡頭，捕捉每一份關於美食與時尚的細膩溫感，為妳的生活提案增加一份優雅。
            </p>
          </div>

          {/* 中間：快速連結 */}
          <div className="md:col-span-3 space-y-6">
            <h4 className="text-[10px] tracking-[0.4em] font-bold text-secondary uppercase">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-secondary/60">
              <li><Link to="/travel" className="hover:text-primary transition-colors">出國旅遊</Link></li>
              <li><Link to="/newTaipei" className="hover:text-primary transition-colors">新北食記</Link></li>
              <li><Link to="/taipei" className="hover:text-primary transition-colors">台北食記</Link></li>
              <li><Link to="/taichung" className="hover:text-primary transition-colors">台中食記</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">關於二姊</Link></li>
            </ul>
          </div>

          {/* 右側：追蹤我們 */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-[10px] tracking-[0.4em] font-bold text-secondary uppercase">Follow the Journey</h4>
            <div className="flex flex-col gap-4">
              <a 
                href="https://instagram.com/xun.g_foodie" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-sm text-secondary/60 hover:text-secondary transition-colors"
              >
                {/* 💡 IG 圖標背景改為白色，在橘色底上更亮眼 */}
                <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                  IG
                </span>
                @xun.g_foodie
              </a>
              <p className="text-[11px] text-secondary/40 italic pt-4">
                商業合作洽詢：<br />
                xungfoodie@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* 💡 下層：版權資訊與回到頂部 (移除中間的 Gourmet 文字區塊) */}
        <div className="pt-12 border-t border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-secondary/40 tracking-widest uppercase font-medium">
            © {currentYear} XUN.G_FOODIE. ALL RIGHTS RESERVED.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-[10px] tracking-[0.5em] text-secondary hover:text-primary transition-all flex items-center gap-2 uppercase font-bold"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;