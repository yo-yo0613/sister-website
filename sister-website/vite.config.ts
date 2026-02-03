import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    Sitemap({ 
      hostname: 'https://xungfoodie.web.app', // 你的網站網址
      dynamicRoutes: [
        '/', 
        '/travel', 
        '/post', // 如果你有固定路由，可以手動列出
        'taipei',
        'newTaipei',
        'taichung',
        'contact',
      ],
      // 如果你的食記是從 API 抓的，稍後我們可以再討論如何抓取動態 ID
    }),
  ],
});