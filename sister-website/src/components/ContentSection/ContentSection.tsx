import ArticleCard from './../ArticleCard/ArticleCard';
import { motion } from 'framer-motion';

const ContentSection = () => {
  // 定義統一的容器動畫變數 (Stagger效果)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // 每個子元件間隔 0.15 秒
        delayChildren: 0.1,
      },
    },
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-24">
      {/* 1. Category-based Content: 捲動到此處時觸發 */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16"
      >
        <ArticleCard category="Beauty" title="二姊的保養哲學：低飽和生活感" date="JAN 08, 2026" image="..." />
        <ArticleCard category="Fashion" title="如何運用咖啡色系穿出高級感" date="JAN 07, 2026" image="..." />
        <ArticleCard category="Lifestyle" title="日系簡約風格的居家實踐" date="JAN 06, 2026" image="..." />
      </motion.div>

      {/* 2. 廣告區域：使用優雅的淡入與輕微位移 */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="my-24 border-y border-neutral-100 py-10 text-center"
      >
        <p className="text-[10px] text-neutral-400 tracking-[0.3em] mb-4">ADVERTISEMENT</p>
        <div className="bg-neutral-50 h-32 w-full flex items-center justify-center text-neutral-400 italic">
          二姊自定義廣告區 (可由 Admin 控制)
        </div>
      </motion.div>

      {/* 3. Editorial Picks: 另一組 Stagger 動畫 */}
      <section>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-end border-b border-secondary/10 pb-4 mb-12"
        >
          <h2 className="text-2xl font-serif text-secondary italic">Editorial Picks</h2>
          <button className="text-[10px] tracking-widest text-primary hover:text-secondary transition-colors">VIEW ALL</button>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <ArticleCard category="Design" title="極簡設計的力量：少即是多" date="JAN 05, 2026" image="..." />
          <ArticleCard category="Travel" title="探索日系美學的城市之旅" date="JAN 04, 2026" image="..." />
          <ArticleCard category="Wellness" title="打造專屬的舒壓空間" date="JAN 03, 2026" image="..." />
          <ArticleCard category="Wellness" title="打造專屬的舒壓空間" date="JAN 03, 2026" image="..." />
        </motion.div>
      </section>

      {/* 4. Social Media Block: 由下往上漸現 */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="mt-32 border-t border-neutral-100 pt-20"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-secondary mb-2">Follow us on IG</h2>
          <p className="text-primary text-sm tracking-widest">@SISTER_STUDIO</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map((i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 0.95 }}
              className="aspect-square bg-neutral-100" 
            />
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export default ContentSection;